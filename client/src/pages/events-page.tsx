
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin } from "lucide-react";
import { type SelectEvent } from "@shared/schema";
import { formatDistance } from "date-fns";

export default function EventsPage() {
  const { user } = useAuth();
  const canManageEvents = user?.role === 'admin';

  const registerMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to register');
      return res.json();
    },
  });

  const notifyMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const res = await fetch(`/api/events/${eventId}/notify`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to update notification');
      return res.json();
    },
  });

  const handleRegister = async (eventId: number) => {
    try {
      await registerMutation.mutateAsync(eventId);
      // Automatically enable notifications when registering
      if (!event?.isNotified) {
        handleNotify(eventId);
      }
      toast({
        title: "Successfully registered",
        description: "You will receive email notifications about this event",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleNotify = async (eventId: number) => {
    try {
      await notifyMutation.mutateAsync(eventId);
      toast({
        title: "Notification preferences updated",
        description: "You will receive updates about this event",
      });
    } catch (error) {
      toast({
        title: "Failed to update notifications",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const { data: events, isLoading } = useQuery<SelectEvent[]>({
    queryKey: ["/api/events", user?.constituency, user?.ward, user?.village],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (user?.constituency) params.append('constituency', user.constituency);
      if (user?.ward) params.append('ward', user.ward);
      if (user?.village) params.append('village', user.village);
      
      const res = await fetch(`/api/events?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch events");
      const allEvents = await res.json();
      
      const now = new Date();
      const twelveMonthsFromNow = new Date();
      twelveMonthsFromNow.setMonth(now.getMonth() + 12);
      
      return allEvents.filter((event: SelectEvent) => {
        const eventDate = new Date(event.startTime);
        return event.status === 'upcoming' && eventDate >= now && eventDate <= twelveMonthsFromNow;
      });
    },
    enabled: !!user?.constituency,
  });

  if (!user?.constituency) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-8 text-center">
            Please set your constituency in your profile to see local events.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-8 text-center">
            Loading events...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6 pl-4">
        <h1 className="text-3xl font-bold">Local Events</h1>
        {canManageEvents && (
          <Button onClick={() => window.location.href = '/events/create'}>
            Create Event
          </Button>
        )}
      </div>
      <div className="grid gap-4">
        {events?.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{event.title}</CardTitle>
                <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                  {event.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{event.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDistance(new Date(event.startTime), new Date(), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(event.startTime).toLocaleTimeString()} - 
                    {event.endTime && new Date(event.endTime).toLocaleTimeString()}
                  </span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            <div className="flex gap-2 mt-4">
                <Button
                  variant="default"
                  onClick={() => window.location.href = `/events/${event.id}`}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {events?.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              No events found in your constituency.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
