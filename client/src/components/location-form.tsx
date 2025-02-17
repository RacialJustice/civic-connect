import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

type LocationFormData = {
  village: string;
  ward: string;
  constituency: string;
};

export function LocationForm() {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<LocationFormData>({
    defaultValues: {
      village: user?.village || "",
      ward: user?.ward || "",
      constituency: user?.constituency || "",
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: async (data: LocationFormData) => {
      const res = await apiRequest("PATCH", "/api/user/location", data);
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
        <Label htmlFor="village">Village</Label>
        <Input
          id="village"
          {...form.register("village")}
          placeholder="Enter your village"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ward">Ward</Label>
        <Input
          id="ward"
          {...form.register("ward")}
          placeholder="Enter your ward"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="constituency">Constituency</Label>
        <Input
          id="constituency"
          {...form.register("constituency")}
          placeholder="Enter your constituency"
        />
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