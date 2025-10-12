// This component renders a single navigation item for the desktop view.
import Link from "next/link";

// Defines the properties for the NavItem component.
interface NavItemProps {
  href: string; // The URL the navigation item links to.
  label: string; // The text displayed for the navigation item.
  isActive: boolean; // Indicates if the navigation item is currently active.
}

// Defines the structure of the NavItem component.
export default function NavItem({ href, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      // Applies conditional styling based on whether the item is active.
      className={`w-28 rounded-full py-3 text-center text-sm font-medium whitespace-nowrap transition-all duration-200 ${
        isActive
          ? "transform bg-blue-500 text-white shadow-md" // Active state styling.
          : "hover:bg-[var(--background)] hover:text-[var(--foreground-muted)] hover:shadow-sm" // Inactive state styling.
      }`}
    >
      {label}
    </Link>
  );
}
