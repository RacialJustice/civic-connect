import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ErrorBoundary } from "@/components/error-boundary";

type Leader = {
  id: number;
  name: string;
  role: string;
  level: 'national' | 'county' | 'constituency' | 'ward';
  position: string;
  party: string;
  constituency?: string;
  county?: string;
};

export function LeadersList() {
  const { user } = useAuth();

  const { data: leaders, isLoading } = useQuery<Leader[]>({
    queryKey: ['/api/leaders', {
      ward: user?.ward,
      constituency: user?.constituency,
      county: user?.county
    }],
    enabled: !!user?.constituency // Only fetch when constituency is available
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!leaders || leaders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Local Leaders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {user?.constituency ? 
              `No leaders found for ${user.constituency} constituency.` :
              'Please complete your location information to see your local leaders.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {leaders.map((leader) => (
        <Card key={leader.id} className="w-full">
          <CardHeader>
            <CardTitle>{leader.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{leader.role}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">Party: {leader.party}</p>
              {leader.constituency && (
                <p className="text-sm">Constituency: {leader.constituency}</p>
              )}
              {leader.county && (
                <p className="text-sm">County: {leader.county}</p>
              )}
              <Button variant="secondary">Send Feedback</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}