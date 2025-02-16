import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { OfficialCard } from "@/components/official-card";
import { RecommendedPosts } from "@/components/recommended-posts";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "@/components/error-boundary";

export default function HomePage() {
  const { data: officials, isLoading } = useQuery<any[]>({
    queryKey: ['/api/officials'],
  });

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <section className="mb-8">
            <h1 className="text-4xl font-bold">Welcome to Civic Platform</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Stay connected with your local government and elected officials
            </p>
          </section>

          <ErrorBoundary>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : officials?.length ? (
              <div className="space-y-8">
                {['national', 'county', 'constituency', 'ward'].map((level) => {
                  const levelOfficials = officials.filter(o => o.level === level);
                  if (levelOfficials.length === 0) return null;

                  return (
                    <section key={level}>
                      <h2 className="text-2xl font-semibold mb-4 capitalize">{level} Level Representatives</h2>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {levelOfficials.map((official) => (
                          <OfficialCard key={official.id} official={official} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Officials Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We couldn't find any officials. Please check back later.
                  </p>
                </CardContent>
              </Card>
            )}
          </ErrorBoundary>
        </div>

        <div className="space-y-6">
          <RecommendedPosts />
        </div>
      </div>
    </div>
  );
}