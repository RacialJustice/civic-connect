import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp } from "lucide-react";

type TrendingPost = {
  id: number;
  title: string;
  forumId: number;
  forumName: string;
  upvotes: number;
  commentCount: number;
};

export function HotTopics() {
  const { data: trendingPosts, isLoading } = useQuery<TrendingPost[]>({
    queryKey: ["/api/trending-posts"],
    // Refresh every 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Hot Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trendingPosts?.map((post) => (
            <Link key={post.id} href={`/forums/${post.forumId}`}>
              <div className="group cursor-pointer space-y-2">
                <h3 className="font-medium group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">
                    {post.forumName}
                  </Badge>
                  <span>• {post.upvotes} votes</span>
                  <span>• {post.commentCount} comments</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
