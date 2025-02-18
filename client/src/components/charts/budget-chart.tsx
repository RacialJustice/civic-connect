
import { Bar } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function BudgetChart() {
  const { data } = useQuery({
    queryKey: ["budget-allocation"],
    queryFn: async () => {
      const response = await apiRequest("/api/budget-allocation");
      return response.json();
    }
  });

  const chartData = {
    labels: data?.map(d => d.ward) || [],
    datasets: [{
      label: 'Budget Allocation',
      data: data?.map(d => d.amount) || [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1
    }]
  };

  return <Bar data={chartData} />;
}
