
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { Link } from "wouter";
import { Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

export function Header() {
  const { user, logoutMutation } = useAuth();
  const isMobile = useIsMobile();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/leaders", label: "Leaders" },
    { href: "/forums", label: "Forums" },
    { href: "/dashboard", label: "Dashboard" },
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 p-4">
                  <NavContent />
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
          ) : (
            <div className="flex items-center gap-4">
              <NavContent />
              <div className="flex items-center gap-2 ml-4">
                <span>Welcome, {user?.name || 'User'}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4 mr-2" />
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
