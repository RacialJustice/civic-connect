import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { 
  isValidCounty, 
  isValidConstituencyInCounty, 
  isValidWardInConstituency,
  getCountyByConstituency 
} from "@shared/kenya-locations";
import { useEffect, useState } from "react";

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
  const [county, setCounty] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      village: user?.village || "",
      ward: user?.ward || "",
      constituency: user?.constituency || "",
    },
  });

  const constituency = form.watch("constituency");
  useEffect(() => {
    if (constituency) {
      const newCounty = getCountyByConstituency(constituency);
      setCounty(newCounty);
    } else {
      setCounty(null);
    }
  }, [constituency]);

  const updateLocationMutation = useMutation({
    mutationFn: async (data: LocationFormData) => {
      const county = getCountyByConstituency(data.constituency);
      if (!county) {
        throw new Error("Invalid constituency");
      }

      // First update the profile in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          village: data.village,
          ward: data.ward,
          constituency: data.constituency,
          county,
          profile_complete: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      // Then update auth user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          village: data.village,
          ward: data.ward,
          constituency: data.constituency,
          county,
          profile_complete: true,
        },
      });

      if (updateError) {
        console.error('Auth update error:', updateError);
        throw updateError;
      }

      // Get fresh session to update the UI
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (!sessionData.session?.user) {
        throw new Error("Session not found after update");
      }

      // Invalidate queries to refresh user data
      queryClient.invalidateQueries({ queryKey: ["user"] });

      return sessionData.session.user;
    },
    onSuccess: () => {
      toast({
        title: "Location updated",
        description: "Your location information has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      console.error('Location update error:', error);
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="county">County</Label>
        <Input
          id="county"
          value={county || ""}
          readOnly
          disabled
          className="bg-muted"
        />
        <p className="text-sm text-muted-foreground">
          County is automatically determined based on your constituency
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