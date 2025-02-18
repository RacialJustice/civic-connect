
import { Bar } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export function BudgetAllocationChart() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["budget-allocation", user?.constituency],
    queryFn: async () => {
      const response = await apiRequest("/api/budget-allocation");
      return response.json();
    }
  });

  const chartData = {
    labels: data?.map(d => d.ward) || [],
    datasets: [{
      label: 'Budget Allocation (KES)',
      data: data?.map(d => d.amount) || [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1
    }]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Allocation by Ward</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </CardContent>
    </Card>
  );
}
