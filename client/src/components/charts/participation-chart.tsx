
import { Line } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ParticipationChart() {
  const { data } = useQuery({
    queryKey: ["participation-metrics"],
    queryFn: async () => {
      const response = await apiRequest("/api/participation-metrics");
      return response.json();
    }
  });

  const chartData = {
    labels: data?.map(d => d.date) || [],
    datasets: [
      {
        label: 'Forum Posts',
        data: data?.map(d => d.posts) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Event Attendance',
        data: data?.map(d => d.eventAttendance) || [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Citizen Participation Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </CardContent>
    </Card>
  );
}
