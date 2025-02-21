import { WithLocation } from '@/components/with-location';
import { useLocation } from '@/hooks/use-location';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { EventCard } from '@/components/event-card';
import { useEffect } from 'react';

export default function EventsPage() {
  const { location, loading } = useLocation();

  // Add debug logging
  useEffect(() => {
    console.log('Events Page Location Data:', {
      location,
      loading,
      userLocations: location ? {
        ward: location.ward,
        constituency: location.constituency,
        county: location.county
      } : null
    });
  }, [location, loading]);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', location?.constituency],
    queryFn: async () => {
      if (!location) return [];

      console.log('Fetching events with location:', location);
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .in('region_name', [
          location.constituency,
          location.county,
          location.ward
        ].filter(Boolean))
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true });

      console.log('Events query result:', { data, error });

      if (error) throw error;
      return data;
    },
    enabled: !!location
  });

  // Remove duplicate WithLocation since we're already using useLocation
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Local Events</h1>
          {location && (
            <p className="text-muted-foreground mt-1">
              Events in {[
                location.ward,
                location.constituency,
                location.county
              ].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
        <Link to="/events/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      {isLoading || loading ? (
        <div>Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No events found in your area.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
