import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, LogOut, UserCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { ThemeSwitcher } from "./theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";

export function Header() {
  const auth = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  if (!auth || (!auth.user && auth.logoutMutation.isPending)) {
    return null;
  }

  const { user, logoutMutation } = auth;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/leaders", label: "Leaders" },
    { to: "/forums", label: "Forums" },
    { to: "/polls", label: "Polls" },
    { to: "/events", label: "Events" },
    { to: "/emergency-contacts", label: "Emergency" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link to={to}>
      <Button 
        variant={isActive(to) ? "secondary" : "ghost"}
        className={`px-4 ${isActive(to) ? "bg-accent" : ""}`}
      >
        {label}
      </Button>
    </Link>
  );

  const handleNavigation = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold px-2 py-1.5 rounded-md hover:bg-accent">
              CivicConnect
            </span>
          </Link>
        </div>

        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px] px-6">
              <SheetHeader className="pb-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.to} 
                    to={link.to}
                    onClick={() => {
                      handleNavigation();
                      setIsOpen(false);
                    }}
                  >
                    <Button 
                      variant={isActive(link.to) ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      {link.label}
                    </Button>
                  </Link>
                ))}
                <hr className="my-2" />
                <ThemeSwitcher 
                  variant="ghost" 
                  className="w-full justify-start" 
                  mobile={true}
                />
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="mt-2"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <>
            <nav className="flex-1 ml-8">
              <ul className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink {...link} />
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center gap-4 ml-4">
              <ThemeSwitcher />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 text-sm font-medium">
                    {user?.name || user?.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>
    </header>
  );
}