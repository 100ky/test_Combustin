import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      {/* Application brand name. */}
      <div className="text-xl font-semibold text-[var(--foreground)]">
        Combustion
      </div>
    </Link>
  );
}
