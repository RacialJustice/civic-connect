import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { 
  isValidCounty, 
  isValidConstituencyInCounty, 
  isValidWardInConstituency,
  getCountyByConstituency 
} from "@shared/kenya-locations";

const locationSchema = z.object({
  village: z.string().optional(),
  ward: z.string().optional(),
  constituency: z.string().min(1, "Constituency is required"),
}).refine(
  (data) => {
    if (!data.constituency) return true;
    const county = getCountyByConstituency(data.constituency);
    return !!county;
  },
  {
    message: "Invalid constituency. Please enter a valid constituency name.",
    path: ["constituency"],
  }
).refine(
  (data) => {
    if (!data.ward || !data.constituency) return true;
    return isValidWardInConstituency(data.ward, data.constituency);
  },
  {
    message: "The specified ward does not belong to this constituency",
    path: ["ward"],
  }
);

type LocationFormData = z.infer<typeof locationSchema>;

export function LocationForm() {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      village: user?.village || "",
      ward: user?.ward || "",
      constituency: user?.constituency || "",
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: async (data: LocationFormData) => {
      const county = getCountyByConstituency(data.constituency);
      if (!county) {
        throw new Error("Invalid constituency");
      }

      const res = await apiRequest("PATCH", "/api/user/location", {
        ...data,
        county,
      });
      return res.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      toast({
        title: "Location updated",
        description: "Your location has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LocationFormData) => {
    updateLocationMutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="village">Village (Optional)</Label>
        <Input
          id="village"
          {...form.register("village")}
          placeholder="Enter your village name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ward">Ward (Optional)</Label>
        <Input
          id="ward"
          {...form.register("ward")}
          placeholder="Enter your ward name"
        />
        {form.formState.errors.ward && (
          <p className="text-sm text-destructive">
            {form.formState.errors.ward.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="constituency">
          Constituency <span className="text-destructive">*</span>
        </Label>
        <Input
          id="constituency"
          {...form.register("constituency")}
          placeholder="Enter your constituency name"
        />
        {form.formState.errors.constituency && (
          <p className="text-sm text-destructive">
            {form.formState.errors.constituency.message}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          Required. Your county will be automatically determined based on your constituency.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={updateLocationMutation.isPending}
      >
        {updateLocationMutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Update Location
      </Button>
    </form>
  );
}