import Link from "next/link";

import { auth } from "@/auth";
import { t } from "@/utils/translations";
import { signOutCompletelyAction } from "@/lib/auth-actions";

import SignInButton from "@/components/auth/SignInButton";
import { UserIcon } from "@heroicons/react/24/solid";

export default async function UserPanel() {
  const showUserPanel = process.env.SHOW_USER_PANEL === "true";

  if (!showUserPanel) {
    return null;
  }

  const session = await auth();

  return (
    <div className="flex items-center gap-4">
      {!session ? (
        <SignInButton />
      ) : (
        <div className="group flex items-center justify-end gap-1">
          {/* Hidden part that expands on hover */}
          <div className="flex max-w-0 items-center gap-2 overflow-hidden transition-all duration-300 ease-in-out group-hover:max-w-md">
            <Link
              href="/account"
              className="rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap hover:bg-gray-100"
            >
              Spravovat účet
            </Link>

            <form action={signOutCompletelyAction}>
              <button
                type="submit"
                className="rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap hover:bg-gray-100"
              >
                {t("userPanel.signOut")}
              </button>
            </form>
            {/* Separator */}
            <div className="mx-1 h-6 w-px bg-gray-300"></div>
          </div>

          {/* Always visible part */}
          <div className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm font-medium">
            <span>{session.user.name}</span>
            <UserIcon className="h-5 w-5" />
          </div>
        </div>
      )}
    </div>
  );
}
