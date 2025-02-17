import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useEffect } from "react";
import type { SelectForum, SelectPost } from "@db/schema";

type Forum = SelectForum;
type Post = SelectPost & {
  author: {
    id: number;
    name: string | null;
    email: string;
  };
  upvotes: number;
  downvotes: number;
  userVote: "up" | "down" | null;
};

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

type PostFormData = z.infer<typeof postSchema>;

export default function ForumViewPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const forumId = parseInt(params.id);

  const { data: forum, isLoading: isLoadingForum, error: forumError } = useQuery<Forum>({
    queryKey: [`/api/forums/${forumId}`],
  });

  const { 
    data: posts = [], 
    isLoading: isLoadingPosts,
    error: postsError 
  } = useQuery<Post[]>({
    queryKey: [`/api/forums/${forumId}/posts`],
    enabled: Boolean(forumId),
  });

  // Debug logging
  useEffect(() => {
    if (forumError) {
      console.error('Forum fetch error:', forumError);
    }
    if (postsError) {
      console.error('Posts fetch error:', postsError);
    }
  }, [forumError, postsError]);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      const res = await apiRequest("POST", `/api/forums/${forumId}/posts`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/forums/${forumId}/posts`] });
      form.reset();
    },
  });

  const voteMutation = useMutation({
    mutationFn: async ({
      postId,
      voteType,
    }: {
      postId: number;
      voteType: "up" | "down";
    }) => {
      await apiRequest(
        "POST",
        `/api/forums/${forumId}/posts/${postId}/vote`,
        { type: voteType }
      );

      // Return the updated post data by fetching it
      const res = await apiRequest("GET", `/api/forums/${forumId}/posts`);
      return res.json();
    },
    onSuccess: (updatedPosts) => {
      queryClient.setQueryData([`/api/forums/${forumId}/posts`], updatedPosts);
    },
  });

  if (isLoadingForum || !forum) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">{forum.name}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{forum.description}</p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>Share your thoughts or ask a question</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) =>
                  createPostMutation.mutate(data)
                )}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={createPostMutation.isPending}
                  className="w-full"
                >
                  {createPostMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating post...
                    </>
                  ) : (
                    "Create Post"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoadingPosts ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {post.author.name?.[0] || post.author.email[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <CardDescription>
                          Posted by {post.author.name || post.author.email} on{" "}
                          {format(new Date(post.createdAt), "PPP")}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          voteMutation.mutate({
                            postId: post.id,
                            voteType: "up",
                          })
                        }
                        disabled={voteMutation.isPending}
                      >
                        <ThumbsUp
                          className={`h-4 w-4 ${
                            post.userVote === "up" ? "text-primary" : ""
                          }`}
                        />
                        <span className="ml-1">{post.upvotes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          voteMutation.mutate({
                            postId: post.id,
                            voteType: "down",
                          })
                        }
                        disabled={voteMutation.isPending}
                      >
                        <ThumbsDown
                          className={`h-4 w-4 ${
                            post.userVote === "down" ? "text-primary" : ""
                          }`}
                        />
                        <span className="ml-1">{post.downvotes}</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{post.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Posts Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Be the first to start a discussion in this forum!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}