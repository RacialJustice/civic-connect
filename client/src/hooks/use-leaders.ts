// hooks/use-leaders.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./use-auth";

export type Leader = {
  id: string;
  name: string;
  role: string;
  area: string;
  image_url?: string;
  contact?: string;
  party: string;
};

export function useLeaders() {
  const { user } = useAuth();
  console.log('UseLeaders - User metadata:', {
    rawUser: user,
    metadata: user?.user_metadata,
    constituency: user?.user_metadata?.constituency,
    county: user?.user_metadata?.county
  });
  
  // Get constituency from user metadata
  const userConstituency = user?.user_metadata?.constituency;
  const userCounty = user?.user_metadata?.county;
  const baseConstituency = userConstituency?.trim();

  return useQuery<Leader[]>({
    queryKey: ['leaders', userConstituency, userCounty],
    queryFn: async () => {
      if (!baseConstituency || !userCounty) {
        return [];
      }

      // First get all constituencies to debug
      const { data: allConstituencies } = await supabase
        .from('constituency_leaders')
        .select('constituency');
      
      console.log('Debug - All constituencies:', {
        available: allConstituencies?.map(c => c.constituency),
        searching: baseConstituency,
        exact: allConstituencies?.some(c => c.constituency === baseConstituency),
        caseInsensitive: allConstituencies?.some(c => 
          c.constituency.toLowerCase() === baseConstituency.toLowerCase()
        )
      });

      // Try case-insensitive search
      const { data: constituencyLeaderData, error: constituencyError } = await supabase
        .from('constituency_leaders')
        .select('name, constituency, party')
        .ilike('constituency', baseConstituency)
        .maybeSingle();

      console.log('Leader query results:', {
        searching: baseConstituency,
        found: constituencyLeaderData,
        error: constituencyError?.message
      });

      // Fetch governor with debug logging
      const { data: governorData, error: governorError } = await supabase
        .from('governors')
        .select('*')
        .eq('county', userCounty)
        .single();

      console.log('Governor query:', {
        county: userCounty,
        result: governorData,
        error: governorError
      });

      const leaders: Leader[] = [];
      
      if (constituencyLeaderData) {
        leaders.push({
          id: `mp-${constituencyLeaderData.name}`,
          name: constituencyLeaderData.name,
          role: 'Member of Parliament',
          area: constituencyLeaderData.constituency,
          party: constituencyLeaderData.party,
          contact: ''
        });
      } else {
        console.log('No constituency leader found for:', {
          constituency: baseConstituency,
          availableConstituencies: allConstituencies?.length
        });
      }
      
      if (governorData) {
        leaders.push({
          id: `governor-${governorData.name}`,
          name: governorData.name,
          role: 'Governor',
          area: `${governorData.county} County`,
          party: governorData.party,
          contact: governorData.email || governorData.contact || ''
        });
      }

      if (leaders.length === 0) {
        console.log('Leaders query debug:', {
          constituency: baseConstituency,
          county: userCounty,
          constituencyResult: constituencyLeaderData,
          constituencyError: constituencyError?.message
        });
      }

      return leaders;
    },
    enabled: !!baseConstituency && !!userCounty
  });
}