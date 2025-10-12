// This component renders a single navigation item for the mobile dropdown menu.
import Link from "next/link";

// Defines the properties for the MobileNavItem component.
interface MobileNavItemProps {
  href: string; // The URL the navigation item links to.
  label: string; // The text displayed for the navigation item.
  isActive: boolean; // Indicates if the navigation item is currently active.
  onClick: () => void; // Function to call when the item is clicked, typically to close the mobile menu.
}

// Defines the structure of the MobileNavItem component.
export default function MobileNavItem({
  href,
  label,
  isActive,
  onClick,
}: MobileNavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick} // Handles click events, e.g., closing the mobile menu.
      // Applies conditional styling based on whether the item is active.
      className={`block rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ${
        isActive
          ? "bg-blue-500 text-white shadow-md" // Active state styling.
          : "hover:bg-gray-100 hover:text-[background-muted]" // Inactive state styling.
      }`}
    >
      {label}
    </Link>
  );
}
