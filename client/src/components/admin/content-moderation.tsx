
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function ContentModerationDashboard() {
  const { data: reports, isLoading } = useQuery({
    queryKey: ['/api/moderation/reports'],
  });

  const mutation = useMutation({
    mutationFn: async ({ id, action }: { id: number, action: 'approve' | 'reject' }) => {
      const response = await fetch(`/api/moderation/reports/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      return response.json();
    }
  });

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Moderation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports?.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 border rounded">
              <div>
                <h4 className="font-medium">{report.type}</h4>
                <p className="text-sm text-muted-foreground">{report.content}</p>
              </div>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => mutation.mutate({ id: report.id, action: 'approve' })}
                >
                  Approve
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => mutation.mutate({ id: report.id, action: 'reject' })}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
