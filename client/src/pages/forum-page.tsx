
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useParams, Link } from "wouter";

type Forum = {
  id: number;
  name: string;
  description: string;
  category: string;
  level: string;
  membershipType: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: string;
};

export default function ForumPage() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const { data: forum } = useQuery<Forum>({
    queryKey: ["forum", id],
    queryFn: () => fetch(`/api/forums/${id}`).then((res) => res.json()),
  });

  const { data: posts } = useQuery<Post[]>({
    queryKey: ["forum-posts", id],
    queryFn: () => fetch(`/api/forums/${id}/posts`).then((res) => res.json()),
  });

  if (!forum) return <div>Loading...</div>;

  return (
    <div>
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{forum.name}</h1>
            <p className="text-muted-foreground">{forum.description}</p>
          </div>
          <Button>Start New Topic</Button>
        </div>

        <div className="space-y-4">
          {posts?.map((post) => (
            <Link key={post.id} href={`/forums/${forum.id}/posts/${post.id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
