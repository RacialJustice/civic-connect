
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type SelectEvent } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { formatDistance } from "date-fns";

export default function EventPage() {
  const [, params] = useRoute("/events/:id");
  const eventId = params?.id;

  const { data: event, isLoading } = useQuery<SelectEvent>({
    queryKey: ["/api/events", eventId],
    queryFn: async () => {
      const res = await fetch(`/api/events/${eventId}`);
      if (!res.ok) throw new Error("Failed to fetch event");
      return res.json();
    },
    enabled: !!eventId,
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-8 text-center">
            Loading event...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-8 text-center">
            Event not found
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-3xl">{event.title}</CardTitle>
            <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
              {event.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">{event.description}</p>
          
          <div className="grid gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>
                {formatDistance(new Date(event.startTime), new Date(), { addSuffix: true })}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>
                {new Date(event.startTime).toLocaleTimeString()} - 
                {event.endTime && new Date(event.endTime).toLocaleTimeString()}
              </span>
            </div>

            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{event.location}</span>
              </div>
            )}

            {event.maxAttendees && (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Maximum attendees: {event.maxAttendees}</span>
              </div>
            )}
          </div>

          {event.virtualLink && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Virtual Meeting Link</h3>
              <a href={event.virtualLink} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                Join virtual meeting
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
