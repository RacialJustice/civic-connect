
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Line } from "react-chartjs-2";

export function AnalyticsDashboard() {
  const { data: analytics } = useQuery({
    queryKey: ['/api/analytics'],
  });

  const userStats = {
    labels: analytics?.userGrowth.map(d => d.date) || [],
    datasets: [{
      label: 'New Users',
      data: analytics?.userGrowth.map(d => d.count) || [],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const engagementStats = {
    labels: analytics?.engagement.map(d => d.type) || [],
    datasets: [{
      label: 'Engagement by Type',
      data: analytics?.engagement.map(d => d.count) || [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1
    }]
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Line data={userStats} options={{ maintainAspectRatio: false }} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Engagement Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Bar data={engagementStats} options={{ maintainAspectRatio: false }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
