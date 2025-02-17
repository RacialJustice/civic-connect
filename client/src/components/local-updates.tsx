import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Loader2, PinIcon, AlertCircle, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  type SelectEmergencyService,
  type SelectForum,
  type SelectEvent
} from "@shared/schema";

function UpdateCard({ 
  title, 
  type, 
  content, 
  isPinned = false,
  date,
  location 
}: { 
  title: string;
  type: "emergency" | "forum" | "event";
  content: string;
  isPinned?: boolean;
  date?: Date;
  location: string;
}) {
  return (
    <Card className={`mb-4 ${isPinned ? 'border-primary' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">
            {title}
          </CardTitle>
          {isPinned && <PinIcon className="h-4 w-4 text-primary" />}
        </div>
        <Badge variant={
          type === "emergency" ? "destructive" : 
          type === "event" ? "secondary" : 
          "default"
        }>
          {type}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{content}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(date).toLocaleDateString()}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {location}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LocalUpdates() {
  const { user } = useAuth();

  // Fetch emergency services
  const { data: emergencyServices = [], isLoading: isLoadingEmergency } = useQuery<SelectEmergencyService[]>({
    queryKey: ["/api/emergency-services", user?.ward, user?.constituency, user?.county],
    enabled: !!user,
  });

  // Fetch forums
  const { data: forums = [], isLoading: isLoadingForums } = useQuery<SelectForum[]>({
    queryKey: ["/api/forums", user?.ward, user?.constituency, user?.county],
    enabled: !!user,
  });

  // Fetch events
  const { data: events = [], isLoading: isLoadingEvents } = useQuery<SelectEvent[]>({
    queryKey: ["/api/events", user?.ward, user?.constituency, user?.county],
    enabled: !!user,
  });

  const isLoading = isLoadingEmergency || isLoadingForums || isLoadingEvents;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Filter and sort updates
  const updates = [
    // Emergency services (always pinned)
    ...emergencyServices
      .filter(service => service.status !== "active")
      .map(service => ({
        id: `emergency-${service.id}`,
        title: service.name,
        type: "emergency" as const,
        content: `Status: ${service.status}. ${service.description || ''}`,
        isPinned: true,
        location: [service.ward, service.constituency, service.county].filter(Boolean).join(", "),
        level: service.ward ? "ward" : service.constituency ? "constituency" : "county"
      })),
    
    // Forums
    ...forums.map(forum => ({
      id: `forum-${forum.id}`,
      title: forum.name,
      type: "forum" as const,
      content: forum.description,
      isPinned: forum.level === "ward" || forum.level === "village",
      location: [forum.ward, forum.constituency, forum.county].filter(Boolean).join(", "),
      level: forum.level
    })),

    // Events
    ...events.map(event => ({
      id: `event-${event.id}`,
      title: event.title,
      type: "event" as const,
      content: event.description,
      date: event.startTime,
      isPinned: event.ward || event.village,
      location: [event.ward, event.constituency, event.county].filter(Boolean).join(", "),
      level: event.ward ? "ward" : event.constituency ? "constituency" : "county"
    }))
  ].sort((a, b) => {
    // Pinned items first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then by level (ward -> constituency -> county)
    const levelOrder = { ward: 0, village: 0, constituency: 1, county: 2 };
    return (levelOrder[a.level] || 0) - (levelOrder[b.level] || 0);
  });

  if (updates.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center text-center gap-2">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">
              No updates available for your area. Try updating your location to see relevant updates.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {updates.map(update => (
        <UpdateCard
          key={update.id}
          title={update.title}
          type={update.type}
          content={update.content}
          isPinned={update.isPinned}
          date={update.date}
          location={update.location}
        />
      ))}
    </div>
  );
}
