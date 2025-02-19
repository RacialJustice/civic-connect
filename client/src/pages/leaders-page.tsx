import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Loader2 } from "lucide-react";
import { type SelectOfficial } from "@shared/schema";

export default function LeadersPage() {
  const { user } = useAuth();

  const { data: leaders = [], isLoading } = useQuery<SelectOfficial[]>({
    queryKey: ["/api/leaders", {
      ward: user?.ward,
      constituency: user?.constituency,
      county: user?.county
    }],
    enabled: !!user?.constituency
  });

  if (!user?.constituency) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <Card>
          <CardContent className="py-8 text-center">
            Please set your constituency in your profile to see your local leaders.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Group leaders by their level
  const groupedLeaders = leaders.reduce<Record<string, SelectOfficial[]>>((acc, leader) => {
    const level = leader.level;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(leader);
    return acc;
  }, {});

  // Order levels: ward -> constituency -> county -> national
  const levels = ['ward', 'constituency', 'county', 'national'].filter(level => 
    groupedLeaders[level]?.length > 0
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Leaders</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Leaders representing {user.ward ? `${user.ward}, ` : ''}{user.constituency}, {user.county}
        </p>
      </div>

      <div className="space-y-10">
        {levels.map(level => (
          <section key={level}>
            <h2 className="text-2xl font-semibold mb-6 capitalize">{level} Level Representatives</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {groupedLeaders[level].map((leader) => (
                <Card key={leader.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative h-32 bg-gradient-to-b from-primary/10 to-background">
                      {leader.photo && (
                        <img
                          src={leader.photo}
                          alt={leader.name}
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-24 w-24 rounded-full object-cover border-4 border-background"
                        />
                      )}
                      {!leader.photo && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-24 w-24 rounded-full bg-muted flex items-center justify-center border-4 border-background">
                          <span className="text-2xl font-bold">{leader.name[0]}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-16 px-6">
                    <h3 className="text-xl font-semibold text-center">{leader.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 text-center">{leader.role}</p>

                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      <Badge variant="secondary">{leader.level}</Badge>
                      {leader.party && <Badge>{leader.party}</Badge>}
                    </div>

                    <div className="mt-6 space-y-3">
                      {leader.email && (
                        <Button variant="outline" className="w-full" asChild>
                          <a href={`mailto:${leader.email}`}>
                            <Mail className="mr-2 h-4 w-4" />
                            Email
                          </a>
                        </Button>
                      )}
                      {leader.phone && (
                        <Button variant="outline" className="w-full" asChild>
                          <a href={`tel:${leader.phone}`}>
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}