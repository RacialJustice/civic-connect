import { Navigation } from "@/components/navigation";
import { LeaderCard } from "@/components/leader-card";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { data: leaders, isLoading } = useQuery<User[]>({
    queryKey: ["/api/leaders"],
  });

  return (
    <div>
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Kenya's Leaders</h1>
        
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {leaders?.map((leader) => (
              <LeaderCard key={leader.id} leader={leader} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
