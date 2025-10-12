import AccountManagement from "@/components/account/AccountManagement";
import { getAccount } from "@/lib/api";
import { redirect } from "next/navigation";

const AccountPage = async () => {
  try {
    const account = await getAccount();

    return (
      <main>
        <AccountManagement account={account} />
      </main>
    );
  } catch (error) {
    // Check if the error is a 401 Unauthorized error
    if (error instanceof Error && error.message.includes("401")) {
      redirect("/api/auth/signin?callbackUrl=/account");
    }
    // For other errors, we might want to show an error page or re-throw
    throw error;
  }
};

export default AccountPage;
