import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { addHours, addDays, addWeeks } from "date-fns";

const pollSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(20, "Description must be at least 20 characters").max(500, "Description must be less than 500 characters"),
  duration: z.enum(["24h", "48h", "1w", "custom"]),
  customDuration: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
});

type PollFormData = z.infer<typeof pollSchema>;

const categories = [
  "Infrastructure",
  "Education",
  "Healthcare",
  "Security",
  "Environment",
  "Transportation",
  "Other"
];

export default function NewPollPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<PollFormData>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "1w",
      category: "",
      tags: "",
    },
  });

  const onSubmit = async (data: PollFormData) => {
    try {
      // Calculate end date based on duration
      let endDate = new Date();
      switch (data.duration) {
        case "24h":
          endDate = addHours(new Date(), 24);
          break;
        case "48h":
          endDate = addHours(new Date(), 48);
          break;
        case "1w":
          endDate = addWeeks(new Date(), 1);
          break;
        case "custom":
          if (data.customDuration) {
            endDate = addDays(new Date(), parseInt(data.customDuration));
          }
          break;
      }

      const pollData = {
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.tags?.split(",").map(tag => tag.trim()),
        endDate: endDate.toISOString(),
        authorId: user?.id,
        village: user?.village,
        ward: user?.ward,
        constituency: user?.constituency,
        county: user?.county,
        status: "pending",
      };

      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pollData),
      });

      if (!res.ok) throw new Error("Failed to create poll");

      toast({
        title: "Poll submitted for review",
        description: "Your poll will be reviewed by an admin before being published.",
      });

      setLocation("/polls");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create poll",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    setLocation("/auth");
    return null;
  }

  return (
    <Container>
      <Card>
        <CardHeader>
          <CardTitle>Submit New Poll</CardTitle>
          <CardDescription>
            Create a new poll to gather community feedback. All polls are reviewed by moderators before being published.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Poll Question</Label>
              <Input
                id="title"
                placeholder="What would you like to ask the community?"
                {...form.register("title")}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide context or background information..."
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Poll Duration</Label>
              <RadioGroup
                defaultValue="1w"
                onValueChange={(value) => form.setValue("duration", value as PollFormData["duration"])}
              >
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="24h" id="24h" />
                    <Label htmlFor="24h">24 hours</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="48h" id="48h" />
                    <Label htmlFor="48h">48 hours</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1w" id="1w" />
                    <Label htmlFor="1w">1 week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">Custom</Label>
                    {form.watch("duration") === "custom" && (
                      <Input
                        type="number"
                        placeholder="Number of days"
                        className="w-32 ml-2"
                        {...form.register("customDuration")}
                      />
                    )}
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="w-full p-2 rounded-md border border-input bg-background"
                {...form.register("category")}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {form.formState.errors.category && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <Input
                id="tags"
                placeholder="Enter tags separated by commas"
                {...form.register("tags")}
              />
              <p className="text-sm text-muted-foreground">
                Example: infrastructure, roads, maintenance
              </p>
            </div>

            <Button type="submit" className="w-full">
              Submit for Review
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}