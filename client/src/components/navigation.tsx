import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LogOut, Menu, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export function Navigation() {
  const { user, logoutMutation } = useAuth();
  const isMobile = useIsMobile();

  const mainNavLinks = [
    { href: "/", label: "Home" },
    { href: "/emergency-services", label: "Emergency Services" },
  ];

  const engagementLinks = [
    { href: "/leaders", label: "Leaders" },
    { href: "/forums", label: "Forums" },
    { href: "/events", label: "Events" },
    { href: "/polls", label: "Polls & Surveys" },
    { href: "/community", label: "Community" },
  ];

  const resourcesLinks = [
    { href: "/documents", label: "Documents" },
    { href: "/calendar", label: "Calendar" },
    { href: "/reports", label: "Reports" },
    { href: "/local-updates", label: "Local Updates" },
    { href: "/projects", label: "Development Projects" },
  ];

  const servicesLinks = [
    { href: "/services/permits", label: "Permits & Licenses" },
    { href: "/services/payments", label: "Payments" },
    { href: "/services/support", label: "Support" },
  ];

  const accountLinks = [
    { href: "/profile", label: "Profile Overview" },
    { href: "/profile/notifications", label: "Notifications" },
    { href: "/profile/settings", label: "Settings" },
    { href: "/profile/security", label: "Security" },
  ];

  const adminLinks = user?.role === "admin" ? [
    { href: "/admin/moderation", label: "Content Moderation" },
    { href: "/admin/users", label: "User Management" },
    { href: "/admin/analytics", label: "Analytics" },
  ] : [];

  const NavDropdown = ({ label, links }: { label: string; links: { href: string; label: string; }[] }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1">
          {label} <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {links.map((link) => (
          <DropdownMenuItem key={link.href}>
            <Link href={link.href} className="w-full">
              {link.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const NavContent = () => (
    <>
      {mainNavLinks.map((link) => (
        <Link key={link.href} href={link.href}>
          <Button variant="ghost">{link.label}</Button>
        </Link>
      ))}
      <NavDropdown label="Engagement" links={engagementLinks} />
      <NavDropdown label="Resources" links={resourcesLinks} />
      <NavDropdown label="Services" links={servicesLinks} />
      <NavDropdown label="Account" links={accountLinks} />
      {user?.role === "admin" && <NavDropdown label="Admin" links={adminLinks} />}
    </>
  );

  const MobileNavLinks = ({ links, label }: { links: { href: string; label: string; }[]; label: string }) => (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm text-muted-foreground mb-1">{label}</h3>
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="block px-2 py-1.5 hover:bg-accent rounded-md">
          {link.label}
        </Link>
      ))}
    </div>
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
                <div className="p-6 space-y-6">
                  <MobileNavLinks links={mainNavLinks} label="Main" />
                  <MobileNavLinks links={engagementLinks} label="Engagement" />
                  <MobileNavLinks links={resourcesLinks} label="Resources" />
                  <MobileNavLinks links={servicesLinks} label="Services" />
                  <MobileNavLinks links={accountLinks} label="Account" />
                  {user?.role === "admin" && (
                    <MobileNavLinks links={adminLinks} label="Admin" />
                  )}
                  <div className="pt-4 border-t">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => logoutMutation.mutate()}
                      disabled={logoutMutation.isPending}
                      className="w-full"
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
          )}
        </div>
      </div>
    </nav>
  );
}
