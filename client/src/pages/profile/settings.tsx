import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from "@/hooks/use-settings";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const [language, setLanguage] = useState(settings?.language || "en");

  const handleLanguageChange = async (value: string) => {
    setLanguage(value);
    try {
      await updateSettings({ language: value });
      toast({
        title: "Settings updated",
        description: "Your language preference has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update language settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch
              id="email-notifications"
              checked={settings?.emailNotifications}
              onCheckedChange={(checked) =>
                updateSettings({ emailNotifications: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <Switch
              id="push-notifications"
              checked={settings?.pushNotifications}
              onCheckedChange={(checked) =>
                updateSettings({ pushNotifications: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language & Region</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Display Language</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="sw">Swahili</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="public-profile">Public Profile</Label>
            <Switch
              id="public-profile"
              checked={settings?.publicProfile}
              onCheckedChange={(checked) =>
                updateSettings({ publicProfile: checked })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
