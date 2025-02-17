
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LogOut, Menu } from "lucide-react";
import { 
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from "@/components/ui/drawer";

export function Navigation() {
  const { user, logoutMutation } = useAuth();
  const isMobile = useIsMobile();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/leaders", label: "Leaders" },
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
    <nav className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold cursor-pointer">
            <Link href="/">Civic Connect</Link>
          </div>

          {isMobile ? (
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Menu</DrawerTitle>
                </DrawerHeader>
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
              </DrawerContent>
            </Drawer>
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
    </nav>
  );
}
