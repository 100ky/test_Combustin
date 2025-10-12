import Logo from "@/components/ui/Logo";
import NavBar from "@/components/navigation/NavBar";
import UserPanel from "@/components/auth/UserPanel";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-1100 h-24 border-b border-[var(--background-muted)] shadow-lg backdrop-blur-sm md:h-20">
      <div className="flex h-full flex-row">
        {/* Left column: Logo */}
        <div className="flex items-center justify-center border-[var(--foreground)] py-2 pl-4">
          <Logo />
        </div>

        {/* Right column */}
        <div className="flex flex-1 flex-col gap-2 px-4 py-2 md:flex-row md:items-center md:gap-0">
          {/* Mobile layout (stacked) */}
          <div className="flex w-full flex-col md:hidden">
            {/* UserPanel aligned right */}
            <div className="flex justify-end">
              <UserPanel />
            </div>

            {/* NavBar fully right-aligned */}
            <div className="flex w-full justify-end">
              <div className="absolute top-12">
                <NavBar />
              </div>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden flex-1 items-center justify-center md:flex">
            <NavBar />
          </div>

          <div
            className="hidden items-center justify-end md:flex"
            style={{ minWidth: "350px" }}
          >
            <UserPanel />
          </div>
        </div>
      </div>
    </header>
  );
}
