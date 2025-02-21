import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type Leader = {
  id: string;
  name: string;
  role: string;
  level: string;
  ward?: string;
  constituency?: string;
  county: string;
  party?: string;
  email?: string;
  phone?: string;
  photo?: string;
};
export function useLeaders(constituency?: string, county?: string) {
  return useQuery<Leader[], Error>({
    queryKey: ['leaders', constituency, county],
    queryFn: async () => {
      if (!constituency || !county) {
        console.log("Missing location data:", { constituency, county });
        return [];
      }
      
      // Extract base constituency name without county parentheses
      const baseConstituency = constituency.split(' (')[0];
      
      console.log("Querying leaders with normalized location:", { 
        baseConstituency, 
        county,
        originalConstituency: constituency 
      });
      
      // Use .ilike for case-insensitive matching
      const { data, error } = await supabase
        .from('elected_leaders')
        .select('*')
        .or(`county.ilike.%${county}%,constituency.ilike.%${baseConstituency}%`);
      
      if (error) {
        console.error("Leaders query error:", error);
        throw error;
      }
      
      // Filter out duplicates by role and constituency
      const uniqueLeaders = data?.reduce((acc, leader) => {
        const key = `${leader.role}-${leader.constituency}-${leader.county}`;
        if (!acc[key]) acc[key] = leader;
        return acc;
      }, {});
      
      return Object.values(uniqueLeaders).map(leader => ({
        id: `${leader.id}`,
        name: leader.name,
        role: leader.role === 'MP' ? 'Member of Parliament' : leader.role,
        level: getLeaderLevel(leader.role),
        ward: leader.ward,
        constituency: leader.constituency,
        county: leader.county,
        party: leader.party,
        email: leader.email,
        phone: leader.phone,
        photo: leader.photo_url
      }));
    },
    enabled: !!constituency && !!county
  });
}

function getLeaderLevel(role: string): string {
  if (role === 'MP' || role === 'Member of Parliament') 
    return 'constituency';
  if (role === 'Ward Representative') 
    return 'ward';
  return 'county';
}