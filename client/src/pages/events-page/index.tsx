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
  const { location } = useLocation();

  // Add debug logging
  console.log('Events Page - Location:', {
    location,
    regionNames: location ? [location.ward, location.constituency, location.county] : []
  });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', location?.constituency],
    queryFn: async () => {
      if (!location) {
        console.log('No location available for events query');
        return [];
      }
      
      const regions = [
        location.ward,
        location.constituency,
        location.county
      ].filter(Boolean);

      console.log('Fetching events for regions:', regions);

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .in('region_name', regions);

      if (error) {
        console.error('Events query error:', error);
        throw error;
      }

      console.log('Events found:', data);
      return data;
    },
    enabled: !!location
  });

  return (
    <WithLocation>
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
    </WithLocation>
  );
}
