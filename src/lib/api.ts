import { Incinerator } from "@/types/incinerator";
import { auth } from "@/auth";
import { API_BASE_URL, ORIGIN_URL } from "@/utils/env";

/**
 * A base function for making API requests.
 *
 * @param path The path to the API endpoint.
 * @param options The options for the fetch request.
 * @returns The JSON response from the API.
 */
export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.method && options.method !== "GET") {
    const session = await auth();
    if (session?.accessToken) {
      headers.set("Authorization", `Bearer ${session.accessToken}`);
    }
  }

  const fullApiUrl = `${ORIGIN_URL}${API_BASE_URL}${path}`; // Use imported variables

  const res = await fetch(fullApiUrl, {
    ...options,
    headers,
  });

  if (!res.ok) {
    // More specific error handling can be added here.
    throw new Error(`API request failed: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Fetches all incinerators.
 *
 * @returns A promise that resolves to an array of incinerators.
 */
export async function getIncinerators(): Promise<Incinerator[]> {
  return api<Incinerator[]>("/incinerators", {
    method: "GET",
    cache: "no-store",
  });
}

/**
 * Fetches details for a specific incinerator.
 *
 * @param incineratorId The ID of the incinerator to fetch.
 * @returns A promise that resolves to the incinerator details.
 */
export async function getIncineratorDetails(
  incineratorId: string,
): Promise<Incinerator> {
  return api<Incinerator>(`/incinerators/${incineratorId}`, {
    method: "GET",
    credentials: "omit",
  });
}
