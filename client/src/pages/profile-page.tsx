import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocationForm } from "@/components/location-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Header } from "@/components/header";
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const location = useLocation();
  
  const profileNavItems = [
    { href: "/profile", label: "Overview" },
    { href: "/profile/notifications", label: "Notifications" },
    { href: "/profile/settings", label: "Settings" },
    { href: "/profile/security", label: "Security" },
  ];

  const updateProfileMutation = useMutation({
    mutationFn: async (newName: string) => {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Your Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <nav className="w-full md:w-64 space-y-1">
          {profileNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`block px-4 py-2 rounded-lg ${
                location.pathname === item.href 
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}