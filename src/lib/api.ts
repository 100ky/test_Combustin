import { Incinerator, Building } from "@/types/incinerator";
import { Account } from "@/types/account";
import { auth } from "@/auth";
<<<<<<< HEAD
import { API_BASE_URL, ORIGIN_URL } from "@/utils/env";

/**
 * A base function for making API requests.
 *
 * @param path The path to the API endpoint.
 * @param options The options for the fetch request.
=======

/**
 * A base function for making API requests.
 * It intelligently switches between server-side direct calls and client-side proxied calls.
 *
 * @param path The path to the API endpoint.
 * @param options The options for the fetch request.
 * @param accessToken If provided, indicates a client-side call that should go through the proxy.
>>>>>>> main
 * @returns The JSON response from the API.
 */
export async function api<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
<<<<<<< HEAD

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
=======
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
>>>>>>> main

  const res = await fetch(fullApiUrl, {
    ...options,
    headers,
  });

  if (!res.ok) {
<<<<<<< HEAD
    // Attempt to parse the error body as JSON, falling back to text.
=======
>>>>>>> main
    let errorBody;
    const resClone = res.clone();
    try {
      errorBody = await resClone.json();
<<<<<<< HEAD
    } catch (e) {
      errorBody = await res.text();
    }

=======
    } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
      errorBody = await res.text();
    }
>>>>>>> main
    throw new Error(
      `API request failed with status ${res.status} ${res.statusText}: ${
        typeof errorBody === "string" ? errorBody : JSON.stringify(errorBody)
      }`,
    );
  }

<<<<<<< HEAD
  return res.json();
=======
  // Handle cases where the response might be empty (e.g., a 204 No Content on PATCH/DELETE)
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return undefined as T;
>>>>>>> main
}

/**
 * Fetches all incinerators.
<<<<<<< HEAD
 *
 * @returns A promise that resolves to an array of incinerators.
 */
export async function getIncinerators(accessToken?: string): Promise<Incinerator[]> {
  return api<Incinerator[]>("/incinerators", {
    method: "GET",
    cache: "no-store",
  }, accessToken);
=======
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
>>>>>>> main
}

/**
 * Fetches details for a specific incinerator.
<<<<<<< HEAD
 *
 * @param incineratorId The ID of the incinerator to fetch.
 * @returns A promise that resolves to the incinerator details.
=======
>>>>>>> main
 */
export async function getIncineratorDetails(
  incineratorId: string,
  accessToken?: string,
): Promise<Incinerator> {
<<<<<<< HEAD
  return api<Incinerator>(`/incinerators/${incineratorId}`, {
    method: "GET",
    credentials: "omit",
  }, accessToken);
=======
  return api<Incinerator>(
    `/incinerators/${incineratorId}`,
    {
      method: "GET",
      credentials: "omit",
    },
    accessToken,
  );
>>>>>>> main
}

/**
 * Fetches details for a specific building.
<<<<<<< HEAD
 *
 * @param buildingId The ID of the building to fetch.
 * @returns A promise that resolves to the building details.
=======
>>>>>>> main
 */
export async function getBuildingDetails(
  buildingId: string,
  accessToken?: string,
): Promise<Building> {
<<<<<<< HEAD
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
=======
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
>>>>>>> main
): Promise<Account> {
  return api<Account>(`/account/${account.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
<<<<<<< HEAD
  }, accessToken);
}
=======
  });
}

>>>>>>> main
