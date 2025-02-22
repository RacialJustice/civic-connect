import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { LogOut, Menu, ChevronDown, User, Home } from "lucide-react";
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
    { to: "/emergency-contacts", label: "Emergency Services" },
  ];

  // Define menu sections in desired order
  const navSections = [
    {
      label: "Engagement",
      links: [
        { to: "/leaders", label: "Leaders" },
        { to: "/forums", label: "Community Forums" }, // Updated label
        { to: "/events", label: "Events" },
        { to: "/polls", label: "Polls & Surveys" },
      ]
    },
    {
      label: "Resources",
      links: [
        { to: "/documents", label: "Documents" },
        { to: "/calendar", label: "Calendar" },
        { to: "/reports", label: "Reports" },
        { to: "/local-updates", label: "Local Updates" },
        { to: "/projects", label: "Development Projects" },
        { to: "/budgets", label: "Budget Allocations" }, // Added Budget Allocations link
      ]
    },
    {
      label: "Services",
      links: [
        { to: "/services/permits", label: "Permits & Licenses" },
        { to: "/services/payments", label: "Payments" },
        { to: "/services/support", label: "Support" },
      ]
    }
  ];

  const accountLinks = [
    { to: "/profile", label: "Profile Overview" },
    { to: "/profile/dashboard", label: "Dashboard" }, // Add Dashboard link
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
      <Link to="/" className="inline-block">
        <Button 
          variant={isActive("/") ? "secondary" : "ghost"}
          className={isActive("/") ? "bg-primary-foreground" : ""}
          size="icon"
        >
          <Home className="h-5 w-5" />
          <span className="sr-only">Home</span>
        </Button>
      </Link>
      {navSections.map((section) => (
        <NavDropdown key={section.label} label={section.label} links={section.links} />
      ))}
      <Link to="/emergency-contacts" className="inline-block">
        <Button 
          variant={isActive("/emergency-contacts") ? "secondary" : "ghost"}
          className={isActive("/emergency-contacts") ? "bg-primary-foreground" : ""}
        >
          Emergency Contacts
        </Button>
      </Link>
      {user?.role === "admin" && <NavDropdown label="Admin" links={adminLinks} />}
    </>
  );

  // Update MobileNavLinks to use the new order
  const orderedMobileLinks = [
    { label: "Main", links: [{ to: "/", label: "Home" }] },
    ...navSections,
    { label: "Emergency", links: [{ to: "/emergency-contacts", label: "Emergency Contacts" }] },
    { label: "Account", links: accountLinks },
    ...(user?.role === "admin" ? [{ label: "Admin", links: adminLinks }] : [])
  ];

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
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4 lg:px-8">
          {/* Logo - Responsive sizing */}
          <div className="flex shrink-0 items-center">
            <Link to="/" className="flex items-center">
              <span className="text-base font-semibold sm:text-xl md:text-2xl">
                CivicConnect
              </span>
            </Link>
          </div>

          {/* Mobile Menu */}
          {isMobile ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                asChild
                className="relative"
              >
                <Link to="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[90vh] w-full sm:w-[350px]">
                  <DrawerHeader className="border-b px-4 py-3">
                    <DrawerTitle>Menu</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex flex-col gap-3 overflow-y-auto px-4 py-4">
                    {orderedMobileLinks.map((section) => (
                      <MobileNavLinks 
                        key={section.label} 
                        label={section.label} 
                        links={section.links} 
                      />
                    ))}
                    <div className="mt-auto border-t pt-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          logoutMutation.mutate();
                          setIsDrawerOpen(false);
                        }}
                        disabled={logoutMutation.isPending}
                        className="w-full"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          ) : (
            /* Desktop Menu */
            <div className="hidden items-center justify-between space-x-4 md:flex">
              <div className="flex items-center space-x-2">
                <NavContent />
              </div>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                      <span className="sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 text-sm font-medium">
                      {user?.email}
                    </div>
                    {accountLinks.map((link) => (
                      <DropdownMenuItem key={link.to} asChild>
                        <Link to={link.to} className="w-full">
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem
                      onClick={() => logoutMutation.mutate()}
                      disabled={logoutMutation.isPending}
                      className="text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
