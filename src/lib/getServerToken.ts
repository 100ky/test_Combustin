import "server-only";

import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";

export async function getServerToken(): Promise<JWT | null> {
  const cookie = (await headers()).get("cookie") ?? "";

  if (!cookie) {
    console.warn("⚠️  No session cookie");
    return null;
  }

  try {
    return await getToken({
      req: { headers: { cookie } },
      secret: process.env.AUTH_SECRET,
    });
  } catch (err) {
    console.error("❌ Failed to get server token:", (err as Error).message);
    return null;
  }
}
