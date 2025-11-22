import Button from "@/components/ui/Button";

import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

import { signOutCompletelyAction } from "@/lib/authActions";

import { t } from "@/utils/translations";

export default function SignOutButton() {
  return (
    <form action={signOutCompletelyAction}>
      {/* Desktop version: full text button */}
      <div className="hidden md:block">
        <Button type="submit">{t("userPanel.signOut")}</Button>
      </div>

      {/* Mobile version: icon-only button with a11y support */}
      <div className="block md:hidden">
        <button
          className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-3 hover:bg-[var(--background-muted)] hover:text-[var(--foreground-muted)]"
          aria-label={t("userPanel.signOut")}
          type="submit"
        >
          <ArrowRightStartOnRectangleIcon className="h-6 w-6" />

          <span>{t("userPanel.signOut")}</span>
        </button>
      </div>
    </form>
  );
}
