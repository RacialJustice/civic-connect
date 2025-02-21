import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container } from '@/components/ui/container';
import { Mail } from "lucide-react";
import { Leader } from '@/hooks/use-leaders';

interface LeadersProps {
  leaders?: Leader[];
  isLoading: boolean;
  constituency?: string;
  county?: string;
}

function LeaderSection({ title, leaders }: { title: string; leaders: Leader[] }) {
  if (leaders.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold capitalize">{title}</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {leaders.map((leader) => (
          <Card key={leader.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex-shrink-0">
                {leader.photo ? (
                  <img 
                    src={leader.photo} 
                    alt={leader.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-2xl font-bold">{leader.name[0]}</span>
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-lg">{leader.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{leader.role}</p>
                <p className="text-sm text-muted-foreground">
                  {leader.ward || leader.constituency || leader.county}
                </p>
                {leader.party && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Party: {leader.party}
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    {leader.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${leader.email}`} className="text-sm hover:underline">
                          {leader.email}
                        </a>
                      </div>
                    )}
                    {leader.phone && (
                      <p className="text-sm text-muted-foreground">📱 {leader.phone}</p>
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

export function Leaders({ leaders = [], isLoading, constituency, county }: LeadersProps) {
  if (isLoading) {
    return <div className="flex justify-center">Loading leaders...</div>;
  }

  if (!leaders?.length) {
    return (
      <div className="text-center p-6 bg-muted rounded-lg">
        <p className="text-muted-foreground">
          No leaders found for {constituency}, {county}
        </p>
        <p className="text-sm mt-2">
          Data might be pending. Please check back later or contact support.
        </p>
        <pre className="text-xs mt-4 text-left bg-slate-900 p-4 rounded overflow-auto">
          {JSON.stringify({ constituency, county }, null, 2)}
        </pre>
      </div>
    );
  }

  const groupedLeaders = leaders.reduce((acc, leader) => {
    const level = leader.level || 'other';
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(leader);
    return acc;
  }, {} as Record<string, typeof leaders>);

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8 text-center">Your Leaders</h1>
      <div className="space-y-8">
        <LeaderSection title="Ward Leaders" leaders={groupedLeaders['ward'] || []} />
        <LeaderSection title="Constituency Leaders" leaders={groupedLeaders['constituency'] || []} />
        <LeaderSection title="County Leaders" leaders={groupedLeaders['county'] || []} />
      </div>
    </Container>
  );
}
