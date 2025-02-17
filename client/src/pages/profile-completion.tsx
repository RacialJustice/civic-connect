import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getCountyByConstituency, validateWardInConstituency } from "@shared/constants";

const profileSchema = z.object({
  village: z.string().optional(),
  ward: z.string().optional(),
  constituency: z.string().min(1, "Constituency is required"),
}).refine(
  (data) => {
    if (!data.ward || !data.constituency) return true;
    return validateWardInConstituency(data.ward, data.constituency);
  },
  {
    message: "The specified ward does not belong to this constituency",
    path: ["ward"],
  }
);

type ProfileData = z.infer<typeof profileSchema>;

export default function ProfileCompletion() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // If user already has location info, redirect to home
  if (user?.ward && user?.county && user?.constituency) {
    setLocation("/");
    return null;
  }

  const form = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      village: user?.village || "",
      ward: user?.ward || "",
      constituency: user?.constituency || "",
    },
  });

  const onSubmit = async (data: ProfileData) => {
    try {
      const county = getCountyByConstituency(data.constituency);
      if (!county) {
        form.setError("constituency", {
          message: "Invalid constituency. Please enter a valid constituency name.",
        });
        return;
      }

      const res = await apiRequest("PATCH", "/api/user/profile", {
        ...data,
        county,
      });
      const updatedUser = await res.json();
      queryClient.setQueryData(["/api/user"], updatedUser);
      setLocation("/");
    } catch (error) {
      form.setError("root", {
        message: error instanceof Error ? error.message : "Failed to update profile",
      });
    }
  };

  return (
    <div className="container max-w-lg py-8">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Help us connect you with your local representatives by providing your location
            details in Kenya. Start with your village and work up to your constituency.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="village"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Village (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your village name" />
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
                      <Input {...field} placeholder="Enter your ward name" />
                    </FormControl>
                    <FormMessage />
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
                      <Input {...field} placeholder="Enter your constituency name" />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground">
                      Required. Your county will be automatically determined based on your constituency.
                    </p>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Complete Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
