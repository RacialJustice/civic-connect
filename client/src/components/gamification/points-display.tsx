import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SelectPoint, SelectBadge, SelectUserBadge } from "@shared/schema";
import { Badge } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PointsDisplayProps {
  userId: number;
}

export function PointsDisplay({ userId }: PointsDisplayProps) {
  const { data: points } = useQuery<SelectPoint[]>({
    queryKey: ["/api/points", userId],
  });

  const { data: badges } = useQuery<(SelectUserBadge & { badge: SelectBadge })[]>({
    queryKey: ["/api/badges", userId],
  });

  const totalPoints = points?.reduce((sum, point) => sum + point.amount, 0) || 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Engagement Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalPoints}</div>
          <Progress value={totalPoints % 100} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Earned Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-4">
              {badges?.map((userBadge) => (
                <div
                  key={userBadge.id}
                  className="flex items-center space-x-4 p-2 rounded-lg bg-muted"
                >
                  <Badge className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-semibold">{userBadge.badge.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {userBadge.badge.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
