import { auth } from "@/auth";
import SignInButton from "@/components/auth/SignInButton";
import SignOutButton from "@/components/auth/SignOutButton";
import { t } from "@/utils/translations";
import Link from "next/link";

export default async function UserPanel() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return <SignInButton />;
  }

  return (
    <div className="group relative">
      <div className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium">
        {user.name}
      </div>
      <div className="absolute right-0 w-48 origin-top-right flex flex-col rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 scale-95 transform transition-all duration-200 ease-in-out group-hover:scale-100 group-hover:opacity-100 invisible group-hover:visible">
        <Link
          href="/account"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          {t("userPanel.editAccount")}
        </Link>
        <div className="px-4 py-1">
            <SignOutButton variant="link" />
        </div>
      </div>
    </div>
  );
}