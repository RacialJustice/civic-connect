import { useQuery } from "@tanstack/react-query";
<<<<<<< HEAD
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { SelectPost } from "@shared/schema";

export function RecommendedPosts() {
  const { data: posts, isLoading } = useQuery<SelectPost[]>({
    queryKey: ['/api/posts/recommended'],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Discussions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : posts?.length ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="space-y-1">
                <h4 className="font-medium">{post.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {post.content.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No discussions available at the moment.
          </p>
        )}
=======
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
>>>>>>> 19c724b7c93c94c7ada61db7cb86557d7bdca27b
      </CardContent>
    </Card>
  );
}
