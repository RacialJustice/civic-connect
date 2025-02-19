import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { Link } from "wouter";
import { Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { UserCircle } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from '../hooks/useTheme';

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function Header() {
  const auth = useAuth();
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();

  if (!auth || (!auth.user && auth.logoutMutation.isPending)) {
    return null;
  }

  const { user, logoutMutation } = auth;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/leaders", label: "Leaders" },
    { href: "/forums", label: "Forums" },
    { href: "/events", label: "Events" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const resourceLinks = [
    { href: "/documents", label: "Documents" },
    { href: "/calendar", label: "Calendar" },
    { href: "/reports", label: "Reports" },
    { href: "/local-updates", label: "Local Updates" },
    { href: "/projects", label: "Development Projects" }
  ];

  const NavContent = () => (
    <>
      {navLinks.map((link) => (
        <Button key={link.href} variant="ghost" asChild>
          <Link href={link.href} className="hover:text-primary-foreground/80">
            {link.label}
          </Link>
        </Button>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Resources</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {resourceLinks.map((link) => (
            <DropdownMenuItem key={link.href} asChild>
              <Link href={link.href}>{link.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <img 
            src="/logo.svg" 
            alt="Civic Connect"
            className="h-8 w-8 dark:invert" 
          />
          <h1 className="text-xl font-bold">
            Civic Connect
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {isMobile ? (
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="border-primary-foreground/20">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 p-4">
                    {navLinks.map((link) => (
                      <Button key={link.href} variant="ghost" asChild>
                        <Link href={link.href}>
                          {link.label}
                        </Link>
                      </Button>
                    ))}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm text-muted-foreground mb-1">Resources</h3>
                      {resourceLinks.map((link) => (
                        <Button key={link.href} variant="ghost" asChild className="w-full justify-start">
                          <Link href={link.href}>
                            {link.label}
                          </Link>
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t">
                      <span>Welcome, {user?.name || 'User'}</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <NavContent />
              <button
                onClick={toggleTheme}
                className="rounded-full p-2 hover:bg-[hsl(var(--header-fg)/0.1)]"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="border-primary-foreground/20">
                      <UserCircle className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <span className="px-2 py-1.5 text-sm text-muted-foreground">
                      {user?.name || 'User'}
                    </span>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => logoutMutation.mutate()}
                      disabled={logoutMutation.isPending}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}