import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';

export function useLeaders() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['leaders', user?.ward, user?.constituency, user?.county],
    queryFn: async () => {
      if (!user?.county) return [];

      const filters = [];
      if (user.ward) filters.push(`ward.eq.${user.ward}`);
      if (user.constituency) filters.push(`constituency.eq.${user.constituency}`);
      if (user.county) filters.push(`county.eq.${user.county}`);

      const query = supabase
        .from('officials')
        .select('*')
        .or(filters.join(','))
        .order('level', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching leaders:', error);
        throw error;
      }

      // Group and sort leaders by level
      const leaders = data || [];
      const levelPriority = { 'ward': 1, 'constituency': 2, 'county': 3, 'national': 4 };
      
      return leaders.sort((a, b) => {
        const levelA = levelPriority[a.level as keyof typeof levelPriority] || 0;
        const levelB = levelPriority[b.level as keyof typeof levelPriority] || 0;
        return levelB - levelA;
      });
    },
    enabled: !!user?.county
  });
}
