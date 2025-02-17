import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ErrorBoundary } from "@/components/error-boundary";

type Leader = {
  id: number;
  name: string;
  level: 'national' | 'county' | 'constituency' | 'ward';
  role: string;
  ward?: string;
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
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const groupedLeaders = leaders?.reduce((acc, leader) => {
    const level = leader.level;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(leader);
    return acc;
  }, {} as Record<string, Leader[]>);

  if (!groupedLeaders) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Leaders Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No leaders are currently available for your location.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedLeaders).map(([level, leaders]) => (
        <section key={level}>
          <h2 className="text-2xl font-semibold mb-4 capitalize">
            {level} Level Leaders
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leaders.map((leader) => (
              <Card key={leader.id}>
                <CardHeader>
                  <CardTitle>{leader.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{leader.role}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {leader.ward && (
                      <p className="text-sm">Ward: {leader.ward}</p>
                    )}
                    {leader.constituency && (
                      <p className="text-sm">Constituency: {leader.constituency}</p>
                    )}
                    {leader.county && (
                      <p className="text-sm">County: {leader.county}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
