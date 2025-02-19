import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export function ModerationMetrics() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['/api/moderation/metrics'],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.averageResponseTime}m
          </div>
          <p className="text-xs text-muted-foreground">
            Average time to review content
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.pendingCount}
          </div>
          <Progress 
            value={metrics.pendingCount / metrics.totalItems * 100} 
            className="mt-2"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Approved</span>
              <span className="font-bold">{metrics.todayApproved}</span>
            </div>
            <div className="flex justify-between">
              <span>Rejected</span>
              <span className="font-bold">{metrics.todayRejected}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}