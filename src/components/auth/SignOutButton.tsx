import Button from "@/components/ui/Button";

import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

import { signOutCompletelyAction } from "@/lib/auth-actions";

import { t } from "@/utils/translations";

type SignOutButtonProps = {
  variant?: "button" | "link";
};

export default function SignOutButton({
  variant = "button",
}: SignOutButtonProps) {
  return (
    <form action={signOutCompletelyAction}>
      {/* Desktop version: full text button */}
      <div className="hidden md:block">
        {variant === "button" ? (
          <Button type="submit">{t("userPanel.signOut")}</Button>
        ) : (
          <button
            type="submit"
            className="hover:bg-muted/50 cursor-pointer rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap"
            aria-label={t("userPanel.signOut")}
          >
            {t("userPanel.signOut")}
          </button>
        )}
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