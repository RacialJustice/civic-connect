
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export function CalendarSync() {
  const { user } = useAuth();

  const syncMutation = useMutation({
    mutationFn: async (calendarId: string) => {
      const response = await fetch(`/api/calendar/sync/${calendarId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to sync calendar');
      return response.json();
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar Sync</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar mode="single" />
        <Button 
          onClick={() => syncMutation.mutate('primary')}
          className="mt-4"
        >
          Sync Events
        </Button>
      </CardContent>
    </Card>
  );
}
