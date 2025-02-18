
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";

export function AttendanceChart() {
  const { data } = useQuery({
    queryKey: ["leader-attendance"],
    queryFn: async () => {
      const response = await apiRequest("/api/leader-attendance");
      return response.json();
    }
  });

  const chartData = {
    labels: data?.map(d => d.leader) || [],
    datasets: [{
      label: 'Session Attendance (%)',
      data: data?.map(d => d.attendanceRate) || [],
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      borderColor: 'rgb(153, 102, 255)',
      borderWidth: 1
    }]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leader Attendance Rates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar data={chartData} options={{ 
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100
              }
            }
          }} />
        </div>
      </CardContent>
    </Card>
  );
}
