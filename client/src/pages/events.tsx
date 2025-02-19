import { useEffect } from 'react';
import { useEvents } from '@/hooks/use-events';

export function EventsPage() {
  const { events, isLoading } = useEvents();

  return (
    <div className="container px-6 py-8 md:px-8 lg:px-12">
      <h1 className="text-3xl font-bold mb-6">Community Events</h1>
      
      {isLoading ? (
        <div>Loading events...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events?.map((event) => (
            <div key={event.id} className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-muted-foreground mb-4">{event.description}</p>
              <div className="text-sm text-muted-foreground">
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Location: {event.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsPage;
