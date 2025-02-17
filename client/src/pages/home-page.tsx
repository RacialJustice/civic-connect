import { Navigation } from "@/components/navigation";
import { LeaderCard } from "@/components/leader-card";
import { LocationForm } from "@/components/location-form";
import { LocalUpdates } from "@/components/local-updates";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { SelectOfficial } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Bell } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  const { data: leaders = [], isLoading } = useQuery<SelectOfficial[]>({
    queryKey: ["/api/leaders"],
  });

  const filteredLeaders = leaders.filter(leader => {
    if (!user?.ward && !user?.constituency) return true;

    return (
      (user.ward && leader.ward === user.ward) ||
      (user.constituency && leader.constituency === user.constituency)
    );
  });

  return (
    <div>
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[300px,1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Location</CardTitle>
              </CardHeader>
              <CardContent>
                <LocationForm />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Updates Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-primary" />
                <h1 className="text-2xl font-bold">Latest Updates</h1>
              </div>
              <LocalUpdates />
            </section>

            {/* Leaders Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Your Local Leaders</h2>
              {isLoading ? (
                <div className="flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredLeaders.map((leader) => (
                    <LeaderCard key={leader.id} leader={leader} />
                  ))}
                  {filteredLeaders.length === 0 && (
                    <p className="text-muted-foreground col-span-full text-center py-8">
                      {user?.ward || user?.constituency
                        ? "No leaders found for your location. Try updating your location details."
                        : "Please update your location to see your local leaders."}
                    </p>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}