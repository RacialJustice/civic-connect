import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocationForm } from "@/components/location-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ProfileOverview() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="flex gap-4">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
              <Button 
                onClick={() => updateProfileMutation.mutate(name)}
                disabled={updateProfileMutation.isPending}
              >
                Save
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-lg">{user?.name}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
          )}
          
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-lg">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <LocationForm />
        </CardContent>
      </Card>
    </div>
  );
}
