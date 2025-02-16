import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, MessageSquare, Plus } from "lucide-react";
import { ErrorBoundary } from "@/components/error-boundary";

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
  _count?: {
    posts: number;
  };
};

function ForumsList() {
  const { user } = useAuth();
  const { data: forums, isLoading, error } = useQuery<Forum[]>({
    queryKey: ["/api/forums"],
    retry: false,
  });

  // Debug logging
  if (error) {
    console.error('Forums fetch error:', error);
  }

  const isModerator = user?.role === "moderator" || user?.role === "admin";

  const groupedForums = forums?.reduce((acc, forum) => {
    const category = forum.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(forum);
    return acc;
  }, {} as Record<string, Forum[]>);

  const categories = groupedForums ? Object.keys(groupedForums) : [];

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    throw error; // This will be caught by the ErrorBoundary
  }

  if (!forums?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Forums Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isModerator
              ? "There are no forums available at the moment. Create one to get started!"
              : "There are no forums available at the moment. Please check back later."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <section key={category}>
          <h2 className="text-2xl font-semibold mb-4 capitalize">
            {category} Forums
          </h2>
          <div className="grid gap-4">
            {groupedForums![category].map((forum) => (
              <Link key={forum.id} href={`/forums/${forum.id}`}>
                <Card className="transition-colors hover:bg-muted/50 cursor-pointer">
                  <CardHeader>
                    <CardTitle>{forum.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {forum._count?.posts || 0} posts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {forum.description}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        {(forum.village || forum.ward || forum.constituency || forum.county) && (
                          <p className="text-sm text-muted-foreground">
                            Location:{" "}
                            {forum.village ||
                              forum.ward ||
                              forum.constituency ||
                              forum.county}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        View Discussion
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function ForumsPage() {
  const { user } = useAuth();
  const isModerator = user?.role === "moderator" || user?.role === "admin";

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Community Forums</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Join discussions about local governance and community matters
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {!isModerator && "Click on any forum to view discussions or ask questions"}
          </p>
        </div>
        {isModerator && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Forum
          </Button>
        )}
      </div>

      <ErrorBoundary>
        <ForumsList />
      </ErrorBoundary>
    </div>
  );
}