import { useEvents } from '@/hooks/use-events';
import { Container } from '@/components/ui/container';

export function EventsPage() {
  const { events, isLoading } = useEvents();

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8 text-center">Community Events</h1>
      
      {isLoading ? (
        <div className="flex justify-center">Loading events...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 place-items-center">
          {events?.map((event) => (
            <div key={event.id} className="rounded-lg border bg-card p-6 w-full max-w-md">
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
    </Container>
  );
}

export default EventsPage;
