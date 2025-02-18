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

export function Header() {
  const auth = useAuth();
  const isMobile = useIsMobile();

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
    { href: "/projects", label: "Development Projects" },
  ];

  const NavContent = () => (
    <>
      {navLinks.map((link) => (
        <Link key={link.href} href={link.href}>
          <span className="hover:text-primary-foreground/80 cursor-pointer">
            {link.label}
          </span>
        </Link>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className="hover:text-primary-foreground/80 cursor-pointer">Resources</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {resourceLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <DropdownMenuItem>{link.label}</DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  return (
    <header className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer">Civic Connect</h1>
          </Link>

          {isMobile ? (
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
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
                      <Link key={link.href} href={link.href}>
                        <span className="block px-2 py-1.5 hover:bg-accent rounded-md">
                          {link.label}
                        </span>
                      </Link>
                    ))}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm text-muted-foreground mb-1">Resources</h3>
                      {resourceLinks.map((link) => (
                        <Link key={link.href} href={link.href}>
                          <span className="block px-2 py-1.5 hover:bg-accent rounded-md">
                            {link.label}
                          </span>
                        </Link>
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
              <div className="flex items-center gap-2 ml-4">
                <ThemeSwitcher />
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
                    <Link href="/profile">
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
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