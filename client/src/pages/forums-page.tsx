
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

type Forum = {
  id: number;
  name: string;
  description: string;
  category: string;
  level: string;
  village?: string;
  ward?: string;
  constituency?: string;
  county?: string;
  membershipType: string;
  createdAt: string;
};

export default function ForumsPage() {
  const { user } = useAuth();
  const { data: forums } = useQuery<Forum[]>({
    queryKey: ["forums"],
    queryFn: () => fetch("/api/forums").then((res) => res.json()),
  });

  const filterForumsByLevel = (level: string) => {
    return forums?.filter((forum) => {
      if (level === "village" && forum.village === user?.village) return true;
      if (level === "ward" && forum.ward === user?.ward) return true;
      if (level === "constituency" && forum.constituency === user?.constituency) return true;
      if (level === "county" && forum.county === user?.county) return true;
      return false;
    });
  };

  return (
    <div>
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Community Forums</h1>
          <Button>Create Forum</Button>
        </div>

        <div className="space-y-8">
          {user && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Village Forums</h2>
                <Link href="/forums/village" className="text-sm text-blue-600 hover:underline">View all</Link>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Trending Topics</h3>
                <div className="flex gap-2 flex-wrap">
                  {filterForumsByLevel("village")?.slice(0, 5).map((forum) => (
                    <Link key={forum.id} href={`/forums/${forum.id}`}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        {forum.category}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filterForumsByLevel("village")?.map((forum) => (
                  <Link key={forum.id} href={`/forums/${forum.id}`}>
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle>{forum.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{forum.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-muted-foreground">{forum.category}</span>
                          <span className="text-sm text-muted-foreground capitalize">{forum.membershipType}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {user && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Ward Forums</h2>
                <Link href="/forums/ward" className="text-sm text-blue-600 hover:underline">View all</Link>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Trending Topics</h3>
                <div className="flex gap-2 flex-wrap">
                  {filterForumsByLevel("ward")?.slice(0, 5).map((forum) => (
                    <Link key={forum.id} href={`/forums/${forum.id}`}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        {forum.category}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filterForumsByLevel("ward")?.map((forum) => (
                  <Link key={forum.id} href={`/forums/${forum.id}`}>
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle>{forum.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{forum.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-muted-foreground">{forum.category}</span>
                          <span className="text-sm text-muted-foreground capitalize">{forum.membershipType}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {user?.constituency && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Constituency Forums</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filterForumsByLevel("constituency")?.map((forum) => (
                  <Link key={forum.id} href={`/forums/${forum.id}`}>
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle>{forum.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{forum.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-muted-foreground">{forum.category}</span>
                          <span className="text-sm text-muted-foreground capitalize">{forum.membershipType}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {user?.county && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">County Forums</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filterForumsByLevel("county")?.map((forum) => (
                  <Link key={forum.id} href={`/forums/${forum.id}`}>
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle>{forum.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{forum.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-muted-foreground">{forum.category}</span>
                          <span className="text-sm text-muted-foreground capitalize">{forum.membershipType}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
