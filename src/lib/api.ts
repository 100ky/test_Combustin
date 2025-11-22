import type { Incinerator, Building } from "@/types/incinerator";
import type { JWT } from "next-auth/jwt";
import { API_BASE_URL, ORIGIN_URL } from "@/utils/env";

/**
 * A base function for making API requests.
 * It intelligently switches between server-side direct calls and client-side proxied calls.
 *
 * @param path The path to the API endpoint.
 * @param options The options for the fetch request.
 * @param getServerToken The function to get the server token.
 * @returns The JSON response from the API.
 */
export async function api<T>(
  path: string,
  options: RequestInit = {},
  getServerToken?: () => Promise<JWT | null>,
): Promise<T> {
  const headers = new Headers(options.headers);
  let fullApiUrl: string;
  let accessToken: string | null = null;

  // Determine if this is a client-side or server-side call.
  const isClientSideCall = typeof window !== "undefined";

  if (isClientSideCall) {
    // Client-side calls use the proxy URL defined in environment variables.
    fullApiUrl = `${ORIGIN_URL}${API_BASE_URL}${path}`;
  } else {
    // Server-side calls (e.g., from Server Actions) use the direct remote URL.
    fullApiUrl = `${process.env.REMOTE_API_BASE_URL}${path}`;
    // Get session and token on the server side if not explicitly passed.
    if (getServerToken) {
      const token = await getServerToken();
      if (token?.accessToken) {
        accessToken = token.accessToken;
      }
    }
  }

  // Add authorization header if a token is available.
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
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
    } catch {
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
export async function getIncinerators(): Promise<Incinerator[]> {
  return api<Incinerator[]>("/incinerators", {
    method: "GET",
    cache: "no-store",
  });
}

/**
 * Fetches details for a specific incinerator.
 */
export async function getIncineratorDetails(
  incineratorId: string,
): Promise<Incinerator> {
  return api<Incinerator>(`/incinerators/${incineratorId}`, {
    method: "GET",
    credentials: "omit",
  });
}

/**
 * Fetches details for a specific building.
 */
export async function getBuildingDetails(
  buildingId: string,
): Promise<Building> {
  return api<Building>(`/buildings/${buildingId}`, {
    method: "GET",
    credentials: "omit",
  });
}
