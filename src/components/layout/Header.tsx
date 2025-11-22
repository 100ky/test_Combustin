import Logo from "@/components/ui/Logo";
import NavBar from "@/components/navigation/NavBar";
import UserPanel from "@/components/auth/UserPanel";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-1100 flex h-[var(--header-height)] items-center border-b border-[var(--background-muted)] shadow-lg backdrop-blur-sm">
      <div className="px-4 py-2">
        <Logo />
      </div>

      {/* Mobile layout */}
      <div className="flex-1 md:hidden">
        <NavBar userPanel={<UserPanel />} />
      </div>

      {/* Desktop layout */}
      <div className="hidden flex-1 items-center justify-center md:flex">
        <NavBar />
      </div>

      <div className="hidden min-w-[350px] justify-end md:flex">
        <UserPanel />
      </div>
    </header>
  );
}
