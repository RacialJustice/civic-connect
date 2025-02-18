
import { Navigation } from "@/components/navigation";
import { EngagementMetrics } from "@/components/engagement-metrics";
import { Chat } from "@/components/chat";
import { SearchInterface } from "@/components/search-interface";
import { useQuery } from "@tanstack/react-query";
import { User, Feedback, SelectEvent, SelectForum } from "@shared/schema";
import { Loader2, Users, Calendar, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: leaders = [], isLoading: isLoadingLeaders } = useQuery<User[]>({
    queryKey: ["/api/leaders"],
    enabled: !!user?.role === 'admin'
  });

  const { data: forums = [], isLoading: isLoadingForums } = useQuery<SelectForum[]>({
    queryKey: ["/api/forums"],
    enabled: !!user
  });

  const { data: events = [], isLoading: isLoadingEvents } = useQuery<SelectEvent[]>({
    queryKey: ["/api/events", user?.ward, user?.constituency],
    enabled: !!user
  });

  const feedbackQueries = useQuery<Feedback[]>({
    queryKey: ["/api/leaders/feedback"],
    enabled: leaders.length > 0 && user?.role === 'admin',
  });

  if (isLoadingLeaders || isLoadingForums || isLoadingEvents || feedbackQueries.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user?.role === 'admin') {
    return (
      <div>
        <main className="container mx-auto px-4 py-8 space-y-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leaders.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Forums</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{forums.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Search</h2>
            <SearchInterface />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <EngagementMetrics
              leaders={leaders}
              feedbacks={feedbackQueries.data || []}
            />
            <Chat />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <main className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-4xl font-bold">Your Local Dashboard</h1>
        <h2 className="text-xl text-muted-foreground">
          {user?.ward ? `${user.ward}, ${user.constituency}` : user?.constituency}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Local Forums</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forums.slice(0, 3).map(forum => (
                  <div key={forum.id} className="flex justify-between items-center">
                    <span>{forum.name}</span>
                    <span className="text-muted-foreground text-sm">{forum.category}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.slice(0, 3).map(event => (
                  <div key={event.id} className="flex justify-between items-center">
                    <span>{event.title}</span>
                    <span className="text-muted-foreground text-sm">
                      {new Date(event.startTime).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Live Chat</h2>
          <Chat />
        </div>
      </main>
    </div>
  );
}
