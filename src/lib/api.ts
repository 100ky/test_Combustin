import { Incinerator, Building } from "@/types/incinerator";
import { Account } from "@/types/account";
import { auth } from "@/auth";

/**
 * A base function for making API requests.
 * It intelligently switches between server-side direct calls and client-side proxied calls.
 *
 * @param path The path to the API endpoint.
 * @param options The options for the fetch request.
 * @param accessToken If provided, indicates a client-side call that should go through the proxy.
 * @returns The JSON response from the API.
 */
export async function api<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
  let fullApiUrl: string;
  let token: string | undefined = accessToken;

  // Determine if this is a client-side or server-side call.
  const isClientSideCall = !!process.env.NEXT_PUBLIC_ORIGIN_URL && typeof window !== 'undefined';

  if (isClientSideCall) {
    // Client-side calls use the proxy URL defined in environment variables.
    fullApiUrl = `${process.env.NEXT_PUBLIC_ORIGIN_URL}${process.env.NEXT_PUBLIC_REMOTE_API_BASE_URL}${path}`;
  } else {
    // Server-side calls (e.g., from Server Actions) use the direct remote URL.
    fullApiUrl = `${process.env.REMOTE_API_BASE_URL}${path}`;
    // Get session and token on the server side if not explicitly passed.
    if (!token) {
        const session = await auth();
        if (session?.accessToken) {
          token = session.accessToken;
        }
    }
  }

  // Add authorization header if a token is available.
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(fullApiUrl, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorBody;
    const resClone = res.clone();
    try {
      errorBody = await resClone.json();
    } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
      errorBody = await res.text();
    }
    throw new Error(
      `API request failed with status ${res.status} ${res.statusText}: ${
        typeof errorBody === "string" ? errorBody : JSON.stringify(errorBody)
      }`,
    );
  }

  // Handle cases where the response might be empty (e.g., a 204 No Content on PATCH/DELETE)
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return undefined as T;
}

/**
 * Fetches all incinerators.
 */
export async function getIncinerators(accessToken?: string): Promise<Incinerator[]> {
  return api<Incinerator[]>(
    "/incinerators",
    {
      method: "GET",
      cache: "no-store",
    },
    accessToken,
  );
}

/**
 * Fetches details for a specific incinerator.
 */
export async function getIncineratorDetails(
  incineratorId: string,
  accessToken?: string,
): Promise<Incinerator> {
  return api<Incinerator>(
    `/incinerators/${incineratorId}`,
    {
      method: "GET",
      credentials: "omit",
    },
    accessToken,
  );
}

/**
 * Fetches details for a specific building.
 */
export async function getBuildingDetails(
  buildingId: string,
  accessToken?: string,
): Promise<Building> {
  return api<Building>(
    `/buildings/${buildingId}`,
    {
      method: "GET",
      credentials: "omit",
    },
    accessToken,
  );
}

/**
 * Fetches account details for the authenticated user. (Server-side only)
 */
export async function getAccount(): Promise<Account> {
  return api<Account>("/account", {
    method: "GET",
    cache: "no-store",
  });
}

/**
 * Updates account details for the authenticated user. (Server-side only)
 */
export async function updateAccount(
  account: Partial<Account>,
): Promise<Account> {
  return api<Account>(`/account/${account.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
  });
}

