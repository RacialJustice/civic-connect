import { Container } from "@/components/ui/container";

const Polls = () => {
  return (
    <Container>
      <h1 className="text-4xl font-bold mb-6">Polls & Surveys</h1>
      <div className="space-y-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Active Polls</h2>
          <p>Participate in current community polls and make your voice heard.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Survey Results</h2>
          <p>View outcomes from recent community surveys and polls.</p>
        </div>
      </div>
    </Container>
  );
};

export default Polls;
