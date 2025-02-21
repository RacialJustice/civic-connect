import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useLeaders } from "@/hooks/use-leaders";
import { Card } from "@/components/ui/card";
import { Leaders } from "@/components/leaders";

export default function LeadersPage() {
  const { user } = useAuth();
  
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('location_constituency, location_county, constituency, county')
        .eq('user_id', user?.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
    select: (data) => ({
      location_constituency: data?.location_constituency || data?.constituency,
      location_county: data?.location_county || data?.county
    })
  });

  const { data: leaders, isLoading } = useLeaders(
    profile?.location_constituency,
    profile?.location_county
  );

  if (!profile?.location_constituency) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6 text-center">
          <p className="text-lg">Please set your location first</p>
          <p className="text-sm text-muted-foreground mt-2">
            Update your location in your profile settings to see your local leaders.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <Leaders 
      leaders={leaders}
      isLoading={isLoading}
      constituency={profile.location_constituency}
      county={profile.location_county}
    />
  );
}
