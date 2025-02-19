
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");

  const { data: preferences } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: async () => {
      const response = await apiRequest("/api/notification-preferences");
      return response.json();
    },
    enabled: !!user
  });

  const { data: whatsapp } = useQuery({
    queryKey: ["whatsapp-notifications"],
    queryFn: async () => {
      const response = await apiRequest("/api/whatsapp-notifications");
      return response.json();
    },
    enabled: !!user
  });

  const updatePreferences = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("/api/notification-preferences", {
        method: "PATCH",
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
    }
  });

  const verifyWhatsapp = useMutation({
    mutationFn: async (data: { phoneNumber: string }) => {
      const response = await apiRequest("/api/whatsapp-notifications/verify", {
        method: "POST",
        body: JSON.stringify(data)
      });
      return response.json();
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-4xl font-bold">Notification Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="eventNotifications">Event Updates</Label>
            <Switch
              id="eventNotifications"
              checked={preferences?.eventNotifications}
              onCheckedChange={(checked) =>
                updatePreferences.mutate({ eventNotifications: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="forumPostNotifications">Forum Posts</Label>
            <Switch
              id="forumPostNotifications"
              checked={preferences?.forumPostNotifications}
              onCheckedChange={(checked) =>
                updatePreferences.mutate({ forumPostNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="leaderUpdates">Leader Updates</Label>
            <Switch
              id="leaderUpdates"
              checked={preferences?.leaderUpdates}
              onCheckedChange={(checked) =>
                updatePreferences.mutate({ leaderUpdates: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="whatsappEnabled">Enable WhatsApp</Label>
            <Switch
              id="whatsappEnabled"
              checked={preferences?.whatsappEnabled}
              onCheckedChange={(checked) =>
                updatePreferences.mutate({ whatsappEnabled: checked })
              }
            />
          </div>

          {preferences?.whatsappEnabled && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Button 
                  onClick={() => verifyWhatsapp.mutate({ phoneNumber })}
                  disabled={verifyWhatsapp.isPending}
                >
                  Verify Number
                </Button>
              </div>
              {whatsapp?.isVerified && (
                <p className="text-sm text-green-600">
                  Phone number verified: {whatsapp.phoneNumber}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
