import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { supabase } from '@/lib/supabase';

interface UserLocation {
  ward: string | null;
  constituency: string;
  county: string;
}

export function useLocation() {
  const { user } = useAuth();
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserLocation() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // First check user metadata
        if (user.user_metadata?.constituency && user.user_metadata?.county) {
          setLocation({
            ward: user.user_metadata.ward || null,
            constituency: user.user_metadata.constituency,
            county: user.user_metadata.county
          });
          setLoading(false);
          return;
        }

        // Fallback to profiles table if metadata is not available
        const { data, error } = await supabase
          .from('profiles')
          .select('ward, constituency, county')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          setLocation({
            ward: data.ward,
            constituency: data.constituency,
            county: data.county
          });
        }
      } catch (err) {
        console.error('useLocation: Error fetching location:', err);
        setError('Failed to fetch location data');
      } finally {
        setLoading(false);
      }
    }

    fetchUserLocation();
  }, [user?.id, user?.user_metadata]);

  return { location, loading, error };
}
