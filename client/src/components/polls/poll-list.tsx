import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { ThumbsUp, Clock, Users } from "lucide-react";
import { formatDistance } from "date-fns";
import type { SelectPoll } from "@shared/schema";

export function PollList() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: polls = [], isLoading } = useQuery<SelectPoll[]>({
    queryKey: ["/api/polls", user?.constituency],
    queryFn: async () => {
      const res = await fetch(`/api/polls?constituency=${user?.constituency}`);
      if (!res.ok) throw new Error("Failed to fetch polls");
      return res.json();
    },
    enabled: !!user?.constituency,
  });

  const voteMutation = useMutation({
    mutationFn: async (pollId: number) => {
      const res = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to vote");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Vote recorded",
        description: "Your vote has been successfully recorded.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const activePollsCount = polls.filter(poll => poll.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community Polls</h2>
        {user && activePollsCount < 5 && (
          <Button asChild>
            <a href="/polls/new">Submit New Issue</a>
          </Button>
        )}
      </div>

      {/* Active Polls */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Polls</h3>
        {polls
          .filter(poll => poll.status === "active")
          .sort((a, b) => b.upvotes - a.upvotes)
          .map((poll) => (
            <Card key={poll.id} className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl">{poll.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{poll.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{poll.upvotes} votes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      Ends {formatDistance(new Date(poll.endDate), new Date(), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <Progress 
                  value={Math.min((poll.upvotes / 100) * 100, 100)} 
                  className="mb-4"
                />

                <Button
                  onClick={() => voteMutation.mutate(poll.id)}
                  disabled={!user || voteMutation.isPending}
                  variant="outline"
                  className="w-full"
                >
                  {voteMutation.isPending ? "Recording vote..." : "Vote"}
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Archived Polls */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Archived Polls</h3>
        {polls
          .filter(poll => poll.status === "closed")
          .sort((a, b) => b.upvotes - a.upvotes)
          .map((poll) => (
            <Card key={poll.id} className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-xl">{poll.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{poll.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{poll.upvotes} votes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Ended {formatDistance(new Date(poll.endDate), new Date(), { addSuffix: true })}</span>
                  </div>
                </div>

                <Progress 
                  value={Math.min((poll.upvotes / 100) * 100, 100)} 
                  className="mb-4 opacity-50"
                />
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}