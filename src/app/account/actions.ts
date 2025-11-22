"use server";

import { revalidatePath } from "next/cache";
import { updateAccount } from "@/lib/account";
import type { Account } from "@/types/account";

/**
 * Server Action to update a user account.
 * This function is called from a client component but executes only on the server,
 * ensuring that the access token never leaves the server environment.
 *
 * @param account - Partial account data to update.
 * @returns An object indicating the success or failure of the operation.
 */
export async function updateAccountAction(
  account: Partial<Account>,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Call the API function to update the account.
    // The access token is automatically retrieved on the server within the `updateAccount` function.
    await updateAccount(account);

    // Revalidate the path after a successful update to ensure fresh data is displayed.
    revalidatePath("/account");

    return { success: true };
  } catch (error) {
    console.error("Failed to update account via Server Action:", error);
    // In case of an error, return failure and the error message.
    return { success: false, error: (error as Error).message };
  }
}
