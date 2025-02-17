import { useQuery } from "@tanstack/react-query";
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
      </CardContent>
    </Card>
  );
}
