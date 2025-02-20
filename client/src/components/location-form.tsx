import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Add this import
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorBoundary } from "@/components/error-boundary";

// Define simplified schema without external functions
const locationSchema = z.object({
  village: z.string().optional(),
  ward: z.string().optional(),
  constituency: z.string().min(1, "Constituency is required"),
});

type LocationFormValues = {
  village?: string;
  ward?: string;
  constituency: string;
};

function LocationFormContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [county, setCounty] = useState<string | null>(null);

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      village: user?.village || "",
      ward: user?.ward || "",
      constituency: user?.constituency || "",
    },
  });

  // Simplified constituencies query
  const { data: constituencies = [], isLoading } = useQuery({
    queryKey: ['constituencies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mps')
        .select('constituency, county, party')
        .order('constituency');
      
      if (error) {
        toast({
          title: "Error loading constituencies",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }
      
      return Array.from(
        new Map(
          data.map(item => [
            item.constituency,
            {
              constituency: item.constituency,
              county: item.county,
              party: item.party
            }
          ])
        ).values()
      );
    }
  });

  async function onSubmit(data: LocationFormValues) {
    try {
      const selectedConstituency = constituencies.find(c => c.constituency === data.constituency);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          location_county: selectedConstituency?.county,
          location_constituency: data.constituency,
          location_ward: data.ward,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Location updated successfully"
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update location",
        variant: "destructive"
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

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
        <Select
          value={form.watch('constituency')}
          onValueChange={(value) => {
            if (!value) return;
            
            form.setValue('constituency', value);
            const selectedConstituency = constituencies.find(c => c.constituency === value);
            if (selectedConstituency?.county) {
              setCounty(selectedConstituency.county);
            }
          }}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoading ? "Loading..." : "Select constituency"} />
          </SelectTrigger>
          <SelectContent>
            {constituencies.map((c) => (
              <SelectItem key={c.constituency} value={c.constituency}>
                {c.constituency} ({c.party})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        disabled={isLoading}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Update Location
      </Button>
    </form>
  );
}

// Wrap the form in an error boundary
export function LocationForm() {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 text-center">
          <p className="text-destructive mb-2">Something went wrong loading the location form.</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      }
    >
      <LocationFormContent />
    </ErrorBoundary>
  );
}