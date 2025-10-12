import { Incinerator, Building } from "@/types/incinerator";
import { Account } from "@/types/account";
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
  accessToken?: string,
): Promise<T> {
  const headers = new Headers(options.headers);

  // If an access token is provided, use it. Otherwise, get the session from the server context.
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  } else {
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
    // Attempt to parse the error body as JSON, falling back to text.
    let errorBody;
    const resClone = res.clone();
    try {
      errorBody = await resClone.json();
    } catch (e) {
      errorBody = await res.text();
    }

    throw new Error(
      `API request failed with status ${res.status} ${res.statusText}: ${
        typeof errorBody === "string" ? errorBody : JSON.stringify(errorBody)
      }`,
    );
  }

  return res.json();
}

/**
 * Fetches all incinerators.
 *
 * @returns A promise that resolves to an array of incinerators.
 */
export async function getIncinerators(accessToken?: string): Promise<Incinerator[]> {
  return api<Incinerator[]>("/incinerators", {
    method: "GET",
    cache: "no-store",
  }, accessToken);
}

/**
 * Fetches details for a specific incinerator.
 *
 * @param incineratorId The ID of the incinerator to fetch.
 * @returns A promise that resolves to the incinerator details.
 */
export async function getIncineratorDetails(
  incineratorId: string,
  accessToken?: string,
): Promise<Incinerator> {
  return api<Incinerator>(`/incinerators/${incineratorId}`, {
    method: "GET",
    credentials: "omit",
  }, accessToken);
}

/**
 * Fetches details for a specific building.
 *
 * @param buildingId The ID of the building to fetch.
 * @returns A promise that resolves to the building details.
 */
export async function getBuildingDetails(
  buildingId: string,
  accessToken?: string,
): Promise<Building> {
  return api<Building>(`/buildings/${buildingId}`, {
    method: "GET",
    credentials: "omit",
  }, accessToken);
}

/**
 * Fetches account details for the authenticated user.
 *
 * @returns A promise that resolves to the user's account details.
 */
export async function getAccount(accessToken?: string): Promise<Account> {
  return api<Account>("/account", {
    method: "GET",
    cache: "no-store",
  }, accessToken);
}

/**
 * Updates account details for the authenticated user.
 *
 * @param account The account data to update.
 * @returns A promise that resolves to the updated account details.
 */
export async function updateAccount(
  account: Partial<Account>,
  accessToken?: string,
): Promise<Account> {
  return api<Account>(`/account/${account.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
  }, accessToken);
}
