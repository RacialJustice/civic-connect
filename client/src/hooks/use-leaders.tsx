import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./use-auth";

export function useLeaders() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['leaders', user?.constituency, user?.county],
    queryFn: async () => {
      if (!user?.constituency) {
        throw new Error('No constituency set in profile');
      }

      console.log('Starting leaders fetch for:', {
        constituency: user.constituency,
        county: user.county
      });

      // First check if we have any leaders in the tables
      const counts = await Promise.all([
        supabase.from('members_of_parliament').select('*', { count: 'exact', head: true }),
        supabase.from('governors').select('*', { count: 'exact', head: true }),
        supabase.from('senators').select('*', { count: 'exact', head: true })
      ]);

      console.log('Table counts:', {
        mps: counts[0].count,
        governors: counts[1].count,
        senators: counts[2].count
      });

      // Debug raw queries first
      const mpDebug = await supabase
        .from('members_of_parliament')
        .select('*');
      console.log('All MPs:', mpDebug.data);

      // Fetch leaders with case-insensitive matching
      const [mpResponse, governorResponse, senatorResponse] = await Promise.all([
        supabase
          .from('members_of_parliament')
          .select('*')
          .ilike('constituency', `%${user.constituency}%`)
          .single(),
        
        user.county ? supabase
          .from('governors')
          .select('*')
          .ilike('county', `%${user.county}%`)
          .single() : null,

        user.county ? supabase
          .from('senators')
          .select('*')
          .ilike('county', `%${user.county}%`)
          .single() : null
      ]);

      console.log('Individual responses:', {
        mp: { data: mpResponse.data, error: mpResponse.error },
        governor: { data: governorResponse?.data, error: governorResponse?.error },
        senator: { data: senatorResponse?.data, error: senatorResponse?.error }
      });

      // Format the results, including those with partial matches
      const leaders = [
        mpResponse.data && {
          ...mpResponse.data,
          role: 'Member of Parliament',
          area: `${user.constituency} Constituency`
        },
        governorResponse?.data && {
          ...governorResponse.data,
          role: 'Governor',
          area: `${user.county} County`
        },
        senatorResponse?.data && {
          ...senatorResponse.data,
          role: 'Senator',
          area: `${user.county} County`
        }
      ].filter(Boolean);

      if (leaders.length === 0) {
        console.warn('No leaders found for location:', {
          constituency: user.constituency,
          county: user.county,
          searchResults: {
            mp: mpResponse.data,
            governor: governorResponse?.data,
            senator: senatorResponse?.data
          }
        });
      }

      return leaders;
    },
    enabled: !!user?.constituency,
    staleTime: 5 * 60 * 1000,
    retry: 1
  });
}
