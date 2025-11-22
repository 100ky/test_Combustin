import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { JWT } from "next-auth/jwt";

/**
 * Configuration for NextAuth.
 * @see https://authjs.dev/reference/nextjs
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Keycloak],
  callbacks: {
    /**
     * This callback is called whenever a JSON Web Token is created (i.e. at sign in)
     * or updated (i.e whenever a session is accessed in the client).
     *
     * It is responsible for persisting the access token and refresh token from the provider.
     * It also handles token rotation (refreshing the access token).
     *
     * @see https://authjs.dev/reference/nextjs/callbacks#jwt
     */
    async jwt({ token, account, trigger }) {
      // On initial sign-in, store tokens from the account object.
      if (account) {
        if (
          account.access_token &&
          account.id_token &&
          account.refresh_token &&
          account.expires_at
        ) {
          token.accessToken = account.access_token;
          token.idToken = account.id_token;
          token.refreshToken = account.refresh_token;
          token.expiresAt = account.expires_at;
        } else {
          throw new Error("❌ Missing token data from account object.");
        }
        return token;
      }

      // If there's no access token (e.g., user not signed in), skip refresh.
      if (!token.accessToken) {
        return { ...token, error: "NoAccessToken" };
      }

      // Manually trigger refreshToken.
      if (trigger === "update") {
        return await refreshToken(token);
      }

      // If the token is still valid, return it.
      if (token.expiresAt && Date.now() < token.expiresAt * 1000) {
        return token;
      }

      // The token has expired, so we need to refresh it.
      return await refreshToken(token);
    },

    /**
     * This callback is called whenever a session is checked.
     *
     * It is responsible for making the access token and other data available to the client-side.
     *
     * @see https://authjs.dev/reference/nextjs/callbacks#session
     */
    async session({ session, token }) {
      session.error = token.error;

      // Extract roles from the ID token
      if (token.idToken) {
        try {
          const decodedToken = JSON.parse(
            Buffer.from(token.idToken.split(".")[1], "base64").toString(),
          );
          if (decodedToken.realm_access && decodedToken.realm_access.roles) {
            session.user.roles = decodedToken.realm_access.roles;
          }
        } catch (e) {
          console.error("Error decoding token roles", e);
        }
      }

      return session;
    },
  },
});

/**
 * Refreshes the access token using the refresh token.
 * @param token The JWT to refresh.
 * @returns The refreshed JWT.
 */
async function refreshToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) {
    console.error("❌ No refresh token available.");
    return { ...token, error: "MissingRefreshToken" };
  }

  const clientId = process.env.AUTH_KEYCLOAK_ID;
  const clientSecret = process.env.AUTH_KEYCLOAK_SECRET;
  const refreshTokenUrl = process.env.REFRESH_TOKEN_URL;

  if (!clientId || !clientSecret || !refreshTokenUrl) {
    console.error(
      "❌ Missing Keycloak environment variables for token refresh.",
    );
    return { ...token, error: "MissingClientCredentials" };
  }

  try {
    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    });

    const res = await fetch(refreshTokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!res.ok) {
      const errorBody = await res.json();
      console.warn(`⚠️ Refresh token request failed: ${res.status}`, errorBody);

      // If the refresh token is invalid, all tokens are revoked.
      if (errorBody.error === "invalid_grant") {
        return {
          ...token,
          accessToken: undefined,
          refreshToken: undefined,
          expiresAt: undefined,
          error: "RefreshTokenInvalidated",
        };
      }

      return { ...token, error: "RefreshTokenFailed" };
    }

    const refreshedTokens = await res.json();

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      idToken: refreshedTokens.id_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fallback to old refresh token
      expiresAt: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
    };
  } catch (err) {
    console.error("❌ Failed to refresh token: " + err);
    return { ...token, error: "RefreshTokenError" };
  }
}
