import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { User, Feedback } from "@shared/schema";

export function EngagementMetrics({ 
  leaders,
  feedbacks
}: { 
  leaders: User[];
  feedbacks: Feedback[];
}) {
  const data = leaders.map(leader => ({
    name: leader.displayName,
    feedbacks: feedbacks.filter(f => f.leaderId === leader.id).length
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="feedbacks" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
