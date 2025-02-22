import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

const EMERGENCY_TYPES = [
  { id: "medical", label: "Medical Emergency" },
  { id: "fire", label: "Fire Emergency" },
  { id: "security", label: "Security Threat" },
  { id: "accident", label: "Traffic Accident" },
  { id: "disaster", label: "Natural Disaster" },
];

export function EmergencyAlertForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [peopleAffected, setPeopleAffected] = useState("");
  const [assistanceNeeded, setAssistanceNeeded] = useState("");

  const alertMutation = useMutation({
    mutationFn: async (alertData: any) => {
      // Insert alert
      const { data: alert, error: alertError } = await supabase
        .from('emergency_alerts')
        .insert([{
          user_id: user?.id,
          type: alertData.type,
          description: alertData.description,
          location: alertData.location,
          people_affected: alertData.peopleAffected,
          assistance_needed: alertData.assistanceNeeded,
          coordinates: alertData.coordinates,
          ward: user?.ward,
          constituency: user?.constituency,
          county: user?.county,
          status: 'active'
        }])
        .select()
        .single();

      if (alertError) throw alertError;

      // Create notification for admins and authorities
      const { error: notifError } = await supabase
        .from('notifications')
        .insert([
          {
            type: 'emergency_alert',
            user_id: null, // null means it's for all admins
            title: `Emergency Alert: ${EMERGENCY_TYPES.find(t => t.id === alertData.type)?.label}`,
            content: `Location: ${alertData.location}\nDescription: ${alertData.description}`,
            priority: 'high',
            metadata: {
              alert_id: alert.id,
              alert_type: alertData.type,
              location: alertData.location,
              coordinates: alertData.coordinates
            }
          }
        ]);

      if (notifError) throw notifError;

      // Send real-time update through Supabase channel
      await supabase.channel('emergency_alerts').send({
        type: 'broadcast',
        event: 'new_emergency',
        payload: { alert }
      });

      return alert;
    },
    onSuccess: () => {
      toast({
        title: "Alert Sent",
        description: "Emergency services have been notified and are responding.",
      });
      // Reset form
      setLocation("");
      setType("");
      setDescription("");
      setPeopleAffected("");
      setAssistanceNeeded("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get current coordinates if available
    let coordinates = null;
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (error) {
      console.warn("Could not get location:", error);
    }

    alertMutation.mutate({
      location,
      type,
      description,
      peopleAffected: parseInt(peopleAffected) || 1,
      assistanceNeeded,
      coordinates,
      userId: user?.id,
      timestamp: new Date().toISOString(),
      status: "active",
      ward: user?.ward,
      constituency: user?.constituency,
      county: user?.county,
    });
  };

  return (
    <Card className="border-destructive">
      <CardHeader className="bg-destructive text-destructive-foreground">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Emergency Alert System
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium">IMPORTANT:</p>
          <p className="text-sm text-muted-foreground mt-1">
            For immediate life-threatening emergencies, ALWAYS call emergency services directly:
            <br />
            Police/Fire: 999 | Ambulance: 112
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Specific location details (building, street, landmarks)"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Emergency Type</label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select emergency type" />
              </SelectTrigger>
              <SelectContent>
                {EMERGENCY_TYPES.map((emergencyType) => (
                  <SelectItem key={emergencyType.id} value={emergencyType.id}>
                    {emergencyType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the emergency situation"
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">People Affected</label>
              <Input
                type="number"
                min="1"
                value={peopleAffected}
                onChange={(e) => setPeopleAffected(e.target.value)}
                placeholder="Number of people"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assistance Needed</label>
              <Input
                value={assistanceNeeded}
                onChange={(e) => setAssistanceNeeded(e.target.value)}
                placeholder="Type of assistance required"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={alertMutation.isPending}
          >
            {alertMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Alert...
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Send Emergency Alert
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}