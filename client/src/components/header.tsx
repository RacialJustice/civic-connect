import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, LogOut, UserCircle, Home, User, Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "./ui/sheet";
import { ThemeSwitcher } from "./theme-switcher";
import { useState } from "react";

export function Header() {
  const auth = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!auth?.user) return null;

  const navigationLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    setIsOpen(false);
    auth.logoutMutation.mutate();
  };

  const NavLink = ({ to, label, className = "" }) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors hover:text-primary
        ${isActive(to) ? 'text-primary' : 'text-muted-foreground'}
        ${className}`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex h-14 md:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex shrink-0 items-center gap-x-2">
            <Link 
              to="/" 
              className="flex items-center text-lg font-semibold sm:text-xl md:text-2xl transition-colors hover:text-primary"
            >
              CivicConnect
            </Link>
          </div>

          {isMobile ? (
            <div className="flex items-center gap-2">
              {/* Profile Quick Access */}
              <Button 
                variant="ghost" 
                size="icon" 
                asChild
                className="relative"
              >
                <Link to="/profile">
                  <UserCircle className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Link>
              </Button>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-[350px] p-0">
                  <SheetHeader className="p-6 pb-2">
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col">
                    {navigationLinks.map((link) => (
                      <SheetClose asChild key={link.to}>
                        <Link
                          to={link.to}
                          className={`flex items-center gap-3 px-6 py-4 text-sm transition-colors
                            ${isActive(link.to) 
                              ? 'bg-accent text-accent-foreground' 
                              : 'hover:bg-accent/50'
                            }`}
                          onClick={() => setIsOpen(false)}
                        >
                          <link.icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                    <div className="px-6 py-4 space-y-4">
                      <ThemeSwitcher mobile className="w-full" />
                      <hr className="border-t border-border" />
                      <Button
                        variant="destructive"
                        onClick={handleLogout}
                        disabled={auth.logoutMutation.isPending}
                        className="w-full"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            /* Desktop Navigation */
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <nav className="flex items-center gap-6 lg:gap-8">
                {navigationLinks.map((link) => (
                  <NavLink key={link.to} {...link} />
                ))}
              </nav>
              <div className="flex items-center gap-3 border-l pl-6">
                <ThemeSwitcher />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => auth.logoutMutation.mutate()}
                  disabled={auth.logoutMutation.isPending}
                  className="whitespace-nowrap"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}