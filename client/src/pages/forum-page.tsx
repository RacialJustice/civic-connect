
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type SelectForum } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ForumPage() {
  const { user } = useAuth();
  const [, params] = useRoute("/forums/:level");
  const level = params?.level;

  const { data: forum, isLoading } = useQuery<SelectForum>({
    queryKey: ["forum", level],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const res = await fetch(`/api/forums/${level}`, {
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error("Failed to fetch forum");
      }
      return res.json();
    },
    enabled: !!user && !!level,
  });

  if (!user) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please sign in to view this forum.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!forum) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Forum Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested forum could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>{forum.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{forum.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
