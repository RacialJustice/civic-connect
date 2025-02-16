import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { ErrorBoundary } from "@/components/error-boundary";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  village: z.string().optional(),
  ward: z.string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Allow empty values
        return val.length >= 2 && /^[a-zA-Z0-9\s-]+$/.test(val);
      },
      {
        message: "Ward must be at least 2 characters and contain only letters, numbers, spaces, and hyphens",
      }
    ),
  constituency: z.string().min(1, "Constituency is required"),
}).refine(
  (data) => {
    if (!data.ward) return true;

    // Add known invalid combinations
    const invalidCombinations = [
      { ward: "Dagoretti", constituency: "Juja" },
      // Add more invalid combinations as needed
    ];

    return !invalidCombinations.some(
      combo => 
        data.ward?.toLowerCase().includes(combo.ward.toLowerCase()) && 
        data.constituency.toLowerCase().includes(combo.constituency.toLowerCase())
    );
  },
  {
    message: "The specified ward does not belong to this constituency. Please verify your ward information.",
    path: ["ward"], // This will show the error under the ward field
  }
);

type ProfileData = z.infer<typeof profileSchema>;

type UserActivity = {
  posts: Array<{
    id: number;
    title: string;
    createdAt: string;
    forum: {
      name: string;
    };
  }>;
};

function ProfileContent() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: userActivity, isLoading: isLoadingActivity } = useQuery<UserActivity>({
    queryKey: ["/api/user/activity"],
    enabled: !!user,
  });

  const form = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      village: user?.village || undefined,
      ward: user?.ward || undefined,
      constituency: user?.constituency || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileData) => {
      const response = await apiRequest("PATCH", "/api/user/profile", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }
      return response.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ProfileData) => {
    try {
      await updateProfileMutation.mutateAsync(data);
    } catch (error) {
      // Error is handled by mutation callbacks
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="text-xl">
            {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.name || "Welcome"}</h1>
          <p className="text-muted-foreground">
            Member since {format(new Date(user.createdAt || new Date()), "PP")}
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information. Only constituency is required - your county will be automatically determined based on your constituency.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="village"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Village (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ward"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ward (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-muted-foreground">
                          If provided, ward must belong to the specified constituency.
                        </p>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="constituency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Constituency *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-muted-foreground">
                          Required. Your county will be automatically determined based on your constituency.
                        </p>
                      </FormItem>
                    )}
                  />
                  {user?.county && (
                    <div className="pt-2">
                      <FormLabel className="text-muted-foreground">County</FormLabel>
                      <p className="text-sm font-medium">{user.county}</p>
                    </div>
                  )}
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Your Activity</CardTitle>
              <CardDescription>
                View your recent forum activities and contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingActivity ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : userActivity?.posts?.length ? (
                <div className="space-y-4">
                  {userActivity.posts.map((post) => (
                    <div key={post.id} className="border-b pb-4">
                      <h3 className="font-medium">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Posted in {post.forum.name} on{" "}
                        {format(new Date(post.createdAt), "PP")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  You haven't made any posts yet. Join the discussion in our
                  forums!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="container py-8">
      <ErrorBoundary>
        <ProfileContent />
      </ErrorBoundary>
    </div>
  );
}