import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function AuditLog() {
  const { data: actions = [], isLoading } = useQuery({
    queryKey: ['/api/moderation/actions'],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moderation Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action: any) => (
            <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <Badge>{action.action_type}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(action.created_at), 'PPp')}
                  </span>
                </div>
                <p className="mt-1 text-sm">
                  {action.action_details.reason || 'No reason provided'}
                </p>
              </div>
              <div className="text-sm text-right">
                <p className="font-medium">{action.moderator.name}</p>
                <p className="text-muted-foreground">{action.content_type}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}