import Link from "next/link";
import { redirect } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";

import { auth } from "@/auth";
import SignInButton from "@/components/auth/SignInButton";
import SignOutButton from "@/components/auth/SignOutButton";

export default async function UserPanel() {
  const showUserPanel = process.env.SHOW_USER_PANEL === "true";

  if (!showUserPanel) {
    return null;
  }

  const session = await auth();

  if (session?.error) {
    redirect("/api/force-sign-out");
  }

  return (
    <div className="flex items-center justify-between gap-4 md:pr-4">
      {!session ? (
        <SignInButton />
      ) : (
        <div className="group flex items-center justify-end gap-1" tabIndex={0}>
          {/* Hidden part that expands on hover */}
          <div className="flex max-w-0 items-center gap-2 overflow-hidden transition-all duration-300 ease-in-out group-focus-within:max-w-md group-hover:max-w-md">
            <SignOutButton />
            {/* Separator */}
            <div className="bg-muted mx-1 h-6 w-px"></div>
          </div>

          {/* Always visible part */}
          <Link
            href="/account"
            className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm font-medium"
          >
            <span>{session.user.name}</span>
            <UserIcon className="h-5 w-5" />
          </Link>
        </div>
      )}
    </div>
  );
}
