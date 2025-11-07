"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { t } from "@/utils/translations";

interface ThemeToggleProps {
  type: "desktop" | "mobile";
}

export default function ThemeToggle({ type }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  if (!mounted) return null;

  return (
    <button
      className={`flex cursor-pointer gap-2 px-3 py-3 hover:bg-[var(--background-muted)] hover:text-[var(--foreground-muted)] ${type === "mobile" ? "mt-2 w-full rounded-lg font-medium" : "rounded-full"}`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      type="button"
      aria-label={t("themeToggle.label")}
    >
      {isDark ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
      {type === "mobile" && (
        <span>{isDark ? t("themeToggle.light") : t("themeToggle.dark")}</span>
      )}
    </button>
  );
}
