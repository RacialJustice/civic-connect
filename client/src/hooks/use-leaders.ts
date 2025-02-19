import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';
import { type SelectOfficial } from '@shared/schema';

export function useLeaders() {
  const { user } = useAuth();

  return useQuery<SelectOfficial[]>({
    queryKey: ['leaders', user?.ward, user?.constituency, user?.county],
    queryFn: async () => {
      if (!user?.county) return [];

      let query = supabase
        .from('officials')
        .select('*')
        .eq('status', 'active');

      // Build location filters
      const filters = [];
      if (user.ward) filters.push(`ward.eq.${user.ward}`);
      if (user.constituency) filters.push(`constituency.eq.${user.constituency}`);
      if (user.county) filters.push(`county.eq.${user.county}`);

      // Combine filters with OR to get all leaders at each level
      if (filters.length > 0) {
        query = query.or(filters.join(','));
      }

      // Order by level importance
      const levelPriority = { 'ward': 1, 'constituency': 2, 'county': 3, 'national': 4 };
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching leaders:', error);
        throw error;
      }

      // Sort leaders by level
      return (data || []).sort((a, b) => {
        const levelA = levelPriority[a.level as keyof typeof levelPriority] || 0;
        const levelB = levelPriority[b.level as keyof typeof levelPriority] || 0;
        return levelA - levelB;
      });
    },
    enabled: !!user?.county
  });
}