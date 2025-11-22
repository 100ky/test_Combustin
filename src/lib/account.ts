import type { Account } from "@/types/account";
import { api } from "@/lib/api";
import { getServerToken } from "@/lib/getServerToken";

/**
 * Fetches account details for the authenticated user. (Server-side only)
 */
export async function getAccount(): Promise<Account> {
  return api<Account>(
    "/account",
    {
      method: "GET",
      cache: "no-store",
    },
    getServerToken,
  );
}

/**
 * Updates account details for the authenticated user. (Server-side only)
 */
export async function updateAccount(
  account: Partial<Account>,
): Promise<Account> {
  return api<Account>(
    `/account/${account.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    },
    getServerToken,
  );
}
