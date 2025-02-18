import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function CreateEventPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventLocation, setEventLocation] = useState(""); // Renamed from location
  const [virtualLink, setVirtualLink] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [format, setFormat] = useState<"physical" | "virtual" | "hybrid">("physical");

  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      if (!res.ok) throw new Error("Failed to create event");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Event created successfully",
        description: "Your event has been created and is now visible to the community",
      });
      setLocation("/events");
    },
    onError: () => {
      toast({
        title: "Failed to create event",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  if (!user?.role || user.role !== "admin") {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-8 text-center">
            You do not have permission to create events.
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEventMutation.mutate({
      title,
      description,
      startTime: new Date(startTime).toISOString(),
      endTime: endTime ? new Date(endTime).toISOString() : null,
      location: eventLocation, // Updated to use eventLocation
      virtualLink,
      maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
      format,
      type: "community_meeting",
      status: "upcoming",
      village: user.village,
      ward: user.ward,
      constituency: user.constituency,
      county: user.county,
      requiresRegistration: true,
    });
  };

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Start Time</label>
              <Input 
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">End Time</label>
              <Input 
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Format</label>
              <select 
                className="w-full rounded-md border p-2"
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                required
              >
                <option value="physical">Physical</option>
                <option value="virtual">Virtual</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Location</label>
              <Input 
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="Physical location (if applicable)"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Virtual Link</label>
              <Input 
                value={virtualLink}
                onChange={(e) => setVirtualLink(e.target.value)}
                placeholder="Meeting link (if virtual/hybrid)"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Maximum Attendees</label>
              <Input 
                type="number"
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(e.target.value)}
                placeholder="Leave empty for no limit"
              />
            </div>

            <Button type="submit" disabled={createEventMutation.isPending} className="w-full">
              {createEventMutation.isPending ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}