import Logo from "@/components/ui/Logo";
import NavBar from "@/components/navigation/NavBar";
import UserPanel from "@/components/auth/UserPanel";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-1100 h-[var(--header-height)] border-b border-[var(--background-muted)] shadow-lg backdrop-blur-sm">
      <div className="flex h-full flex-row">
        {/* Left column: Logo */}
        <div className="border-foreground flex items-center justify-center py-2 pl-4">
          <Logo />
        </div>

        {/* Right column */}
        <div className="flex flex-1 items-center">
          {/* Mobile layout */}
          <div className="flex h-full w-full items-center md:hidden">
            <NavBar userPanel={<UserPanel />} />
          </div>

          {/* Desktop layout */}
          <div className="hidden flex-1 items-center justify-center md:flex">
            <NavBar />
          </div>

          <div className="hidden min-w-[350px] items-center justify-end md:flex">
            <UserPanel />
          </div>
        </div>
      </div>
    </header>
  );
}
