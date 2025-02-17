import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Mail } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type Leader = {
  id: number;
  name: string;
  role: string;
  level: 'national' | 'county' | 'constituency' | 'ward';
  position: string;
  party: string;
  email: string | null;
  constituency?: string;
  county?: string;
  ward?: string;
};

type LeadersByLevel = {
  ward: Leader[];
  constituency: Leader[];
  county: Leader[];
};

function LeaderSection({ title, leaders }: { title: string; leaders: Leader[] }) {
  if (leaders.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {leaders.map((leader) => (
          <Card key={leader.id}>
            <CardHeader>
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg">{leader.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {leader.role === "MP" || leader.role === "legislative" ? "Member of Parliament" : leader.role} - {leader.party}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Area</p>
                      <p>
                        {leader.ward 
                          ? `${leader.ward} Ward`
                          : leader.constituency 
                            ? `${leader.constituency} Constituency`
                            : `${leader.county} County`
                        }
                      </p>
                    </div>
                    {leader.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${leader.email}`} className="text-sm hover:underline">
                          {leader.email}
                        </a>
                      </div>
                    )}
                  </div>
                  <Button variant="outline">Send Feedback</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function LeadersList() {
  const { user } = useAuth();

  const { data: leaders = [], isLoading } = useQuery<Leader[]>({
    queryKey: ['/api/leaders', {
      ward: user?.ward,
      constituency: user?.constituency,
      county: user?.county
    }],
    enabled: !!user?.constituency
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
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            {user?.constituency ? 
              `No leaders found for your location.` :
              'Please complete your location information to see your local leaders.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Remove duplicate MPs (those with legislative role)
  const uniqueLeaders = leaders.reduce<Leader[]>((acc, leader) => {
    // Check if we already have this leader in the same area
    const isDuplicate = acc.some(existing => 
      existing.name === leader.name && 
      existing.constituency === leader.constituency &&
      existing.county === leader.county
    );

    if (!isDuplicate) {
      // If this is a MP/legislative role, standardize to MP
      if (leader.role === "legislative") {
        leader.role = "MP";
      }
      acc.push(leader);
    }
    return acc;
  }, []);

  // Group leaders by their administrative level
  const leadersByLevel = uniqueLeaders.reduce<LeadersByLevel>(
    (acc, leader) => {
      if (leader.ward) {
        acc.ward.push(leader);
      } else if (leader.constituency) {
        acc.constituency.push(leader);
      } else if (leader.county) {
        acc.county.push(leader);
      }
      return acc;
    },
    { ward: [], constituency: [], county: [] }
  );

  return (
    <div className="space-y-8">
      <LeaderSection title="Ward Leaders" leaders={leadersByLevel.ward} />
      <LeaderSection title="Constituency Leaders" leaders={leadersByLevel.constituency} />
      <LeaderSection title="County Leaders" leaders={leadersByLevel.county} />
    </div>
  );
}