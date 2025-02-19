import { useLeaders } from '@/hooks/use-leaders';
import { useAuth } from '@/hooks/use-auth';
import { Container } from '@/components/ui/container';

export function LeadersPage() {
  const { data: leaders, isLoading } = useLeaders();
  const { user } = useAuth();

  const groupedLeaders = leaders?.reduce((acc, leader) => {
    const level = leader.level;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(leader);
    return acc;
  }, {} as Record<string, typeof leaders>);

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8 text-center">Your Leaders</h1>
      
      {!user?.county ? (
        <div className="text-center p-6 bg-muted rounded-lg">
          <p className="text-muted-foreground">Please set your location to see your leaders</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center">Loading leaders...</div>
      ) : !leaders?.length ? (
        <div className="text-center p-6 bg-muted rounded-lg">
          <p className="text-muted-foreground">No leaders found for {user.ward || user.constituency || user.county}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedLeaders || {}).map(([level, levelLeaders]) => (
            <div key={level} className="space-y-4">
              <h2 className="text-2xl font-semibold capitalize">{level} Level Representatives</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {levelLeaders?.map((leader) => (
                  <div key={leader.id} className="rounded-lg border bg-card p-6">
                    <div className="flex items-center gap-4">
                      {leader.photo && (
                        <img 
                          src={leader.photo} 
                          alt={leader.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{leader.name}</h3>
                        <p className="text-sm text-muted-foreground">{leader.role}</p>
                        <p className="text-sm text-muted-foreground">{leader.ward || leader.constituency || leader.county}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

export default LeadersPage;
