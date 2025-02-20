import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
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
import { useState } from 'react';

export function Navigation() {
  const location = useLocation();
  const { user, logoutMutation } = useAuth();
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Helper function to check if a link is active
  const isActive = (path: string) => location.pathname === path;

  const mainNavLinks = [
    { to: "/", label: "Home" },
    { to: "/emergency-services", label: "Emergency Services" },
  ];

  const engagementLinks = [
    { to: "/leaders", label: "Leaders" },
    { to: "/forums", label: "Forums" },
    { to: "/events", label: "Events" },
    { to: "/polls", label: "Polls & Surveys" },
    { to: "/community", label: "Community" },
  ];

  const resourcesLinks = [
    { to: "/documents", label: "Documents" },
    { to: "/calendar", label: "Calendar" },
    { to: "/reports", label: "Reports" },
    { to: "/local-updates", label: "Local Updates" },
    { to: "/projects", label: "Development Projects" },
  ];

  const servicesLinks = [
    { to: "/services/permits", label: "Permits & Licenses" },
    { to: "/services/payments", label: "Payments" },
    { to: "/services/support", label: "Support" },
  ];

  const accountLinks = [
    { to: "/profile", label: "Profile Overview" },
    { to: "/profile/notifications", label: "Notifications" },
    { to: "/profile/settings", label: "Settings" },
    { to: "/profile/security", label: "Security" },
  ];

  const adminLinks = user?.role === "admin" ? [
    { to: "/admin/moderation", label: "Content Moderation" },
    { to: "/admin/users", label: "User Management" },
    { to: "/admin/analytics", label: "Analytics" },
  ] : [];

  const NavDropdown = ({ label, links }: { label: string; links: { to: string; label: string; }[] }) => {
    const [open, setOpen] = useState(false);

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-1">
            {label} <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {links.map((link) => (
            <DropdownMenuItem 
              key={link.to} 
              asChild
              onClick={() => setOpen(false)}
              className={isActive(link.to) ? 'bg-accent' : ''}
            >
              <Link to={link.to} className="w-full block">
                {link.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const NavContent = () => (
    <>
      {mainNavLinks.map((link) => (
        <Link key={link.to} to={link.to} className="inline-block">
          <Button 
            variant={isActive(link.to) ? "secondary" : "ghost"}
            className={isActive(link.to) ? "bg-primary-foreground" : ""}
          >
            {link.label}
          </Button>
        </Link>
      ))}
      <NavDropdown label="Engagement" links={engagementLinks} />
      <NavDropdown label="Resources" links={resourcesLinks} />
      <NavDropdown label="Services" links={servicesLinks} />
      <NavDropdown label="Account" links={accountLinks} />
      {user?.role === "admin" && <NavDropdown label="Admin" links={adminLinks} />}
    </>
  );

  const MobileNavLinks = ({ links, label }: { links: { to: string; label: string; }[]; label: string }) => (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm text-muted-foreground mb-1">{label}</h3>
      {links.map((link) => (
        <Link 
          key={link.to} 
          to={link.to} 
          className={`block px-2 py-1.5 hover:bg-accent rounded-md ${isActive(link.to) ? 'bg-accent' : ''}`}
          onClick={() => setIsDrawerOpen(false)}
        >
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
            <Link to="/">Civic Connect</Link>
          </div>

          {isMobile ? (
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
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
