import { Container } from "@/components/ui/container";
import { PollList } from "@/components/polls/poll-list";
import { useAuth } from "@/hooks/use-auth";

export default function PollsPage() {
  const { user } = useAuth();

  if (!user?.constituency) {
    return (
      <Container>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Community Polls</h1>
          <p className="text-muted-foreground">
            Please set your constituency in your profile to see local polls.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <PollList />
    </Container>
  );
}