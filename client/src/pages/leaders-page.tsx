import { useLeaders } from "@/hooks/use-leaders";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

export default function LeadersPage() {
  const { data: leaders, isLoading, error } = useLeaders();
  const { user } = useAuth();

  if (!user?.constituency) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6 text-center">
          <p className="text-lg">Please set your location first</p>
          <p className="text-sm text-muted-foreground mt-2">
            Update your location in your profile settings to see your local leaders.
          </p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>Failed to load leaders</p>
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  if (!leaders?.length) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Your Local Leaders</h1>
          <p className="text-muted-foreground mt-1">
            Location: {user?.constituency}, {user?.county}
          </p>
        </div>
        
        <Card className="p-6 text-center">
          <p className="text-lg">No leaders found for your location.</p>
          <p className="text-sm text-muted-foreground mt-2">
            We are currently updating our database with leaders for {user?.county} County.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Your Local Leaders</h1>
        <p className="text-muted-foreground mt-1">
          Leaders representing {user.constituency}
          {user.county && `, ${user.county} County`}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {leaders.map((leader) => (
          <Card key={`${leader.role}-${leader.area}`}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={leader.image_url} />
                  <AvatarFallback>{leader.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{leader.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{leader.role}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">{leader.area}</p>
              {leader.contact && (
                <p className="text-sm text-muted-foreground">{leader.contact}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}