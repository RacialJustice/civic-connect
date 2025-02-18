
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { type SelectEvent } from "@shared/schema";
import { formatDistance } from "date-fns";

export default function EventsPage() {
  const { user } = useAuth();

  const { data: events, isLoading } = useQuery<SelectEvent[]>({
    queryKey: ["/api/events", user?.constituency, user?.ward, user?.village],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (user?.constituency) params.append('constituency', user.constituency);
      if (user?.ward) params.append('ward', user.ward);
      if (user?.village) params.append('village', user.village);
      
      const res = await fetch(`/api/events?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
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
      <h1 className="text-3xl font-bold mb-6">Local Events</h1>
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
