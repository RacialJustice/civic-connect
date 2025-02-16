import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lightbulb } from "lucide-react";
import { format } from "date-fns";

type RecommendedPost = {
  id: number;
  title: string;
  forumId: number;
  forumName: string;
  author: {
    name: string | null;
    email: string;
  };
  upvotes: number;
  createdAt: string;
};

export function RecommendedPosts() {
  const { data: recommendations, isLoading } = useQuery<RecommendedPost[]>({
    queryKey: ["/api/recommendations"],
    // Refresh recommendations every 15 minutes
    refetchInterval: 15 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!recommendations?.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((post) => (
            <Link key={post.id} href={`/forums/${post.forumId}`}>
              <div className="group cursor-pointer space-y-2">
                <h3 className="font-medium group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">
                    {post.forumName}
                  </Badge>
                  <span>• {post.upvotes} votes</span>
                  <span>• Posted by {post.author.name || post.author.email.split('@')[0]}</span>
                  <span>• {format(new Date(post.createdAt), 'PP')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
