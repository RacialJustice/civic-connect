import { Container } from "@/components/ui/container";

export default function Community() {
  return (
    <Container>
      <h1 className="text-4xl font-bold mb-6">Community Hub</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Neighborhood Groups</h2>
          <p>Join and participate in local neighborhood groups and initiatives.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Volunteer Opportunities</h2>
          <p>Find ways to give back and help your community.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Local Events</h2>
          <p>Discover community events and gatherings near you.</p>
        </div>
      </div>
    </Container>
  );
}
