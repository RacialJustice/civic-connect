import { useLeaders } from "@/hooks/use-leaders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { WithLocation } from '@/components/with-location';
import { useLocation } from '@/hooks/use-location';

export default function LeadersPage() {
  const { location, loading: locationLoading } = useLocation();

  const { data: leaders = [], isLoading } = useQuery({
    queryKey: ['leaders', location?.constituency],
    queryFn: async () => {
      if (!location) return [];

      console.log('Fetching leaders for:', location);

      const { data: constituencyLeaders, error: constituencyError } = await supabase
        .from('constituency_leaders')
        .select('*')
        .eq('constituency', location.constituency)
        .single();

      const { data: countyLeaders, error: countyError } = await supabase
        .from('governors')
        .select('*')
        .eq('county', location.county)
        .single();

      console.log('Leaders query results:', { 
        constituencyLeaders, 
        countyLeaders,
        constituencyError,
        countyError
      });

      if (constituencyError && countyError) {
        throw new Error('Failed to fetch leaders');
      }

      return [
        ...(constituencyLeaders ? [constituencyLeaders] : []),
        ...(countyLeaders ? [countyLeaders] : [])
      ];
    },
    enabled: !!location
  });

  if (locationLoading || isLoading) {
    return <div>Loading leaders...</div>;
  }

  if (!location) {
    return (
      <Card className="p-6">
        <h2>Location Required</h2>
        <p>Please set your location to see your local leaders.</p>
      </Card>
    );
  }

  if (leaders.length === 0) {
    return (
      <Card className="p-6">
        <h2>No Leaders Found</h2>
        <p>No leaders found for {location.constituency}, {location.county}</p>
      </Card>
    );
  }

  // ...rest of the component...
}
