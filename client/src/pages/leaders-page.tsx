import { Navigation } from "@/components/navigation";
import { LeadersList } from "@/components/leaders-list";

export default function LeadersPage() {
  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Local Leaders</h1>
        <LeadersList />
      </main>
    </div>
  );
}