
import { Navigation } from "@/components/navigation";
import { EngagementMetrics } from "@/components/engagement-metrics";
import { Chat } from "@/components/chat";
import { SearchInterface } from "@/components/search-interface";
import { useQuery } from "@tanstack/react-query";
import { User, Feedback } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function Dashboard() {
  const { user, isLoading: isLoadingAuth } = useAuth();

  if (!user || user.role !== 'admin') {
    return <Redirect to="/profile" />;
  }
  
  const { data: leaders = [], isLoading: isLoadingLeaders } = useQuery<User[]>({
    queryKey: ["/api/leaders"],
    enabled: !!user?.role === 'admin'
  });

  const feedbackQueries = useQuery<Feedback[]>({
    queryKey: ["/api/leaders/feedback"],
    enabled: leaders.length > 0 && user?.role === 'admin',
  });

  if (isLoadingAuth || isLoadingLeaders || feedbackQueries.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Redirect to="/profile" />;
  }

  return (
    <div>
      <main className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>

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
