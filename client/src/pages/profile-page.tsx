
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/navigation";
import { LocationForm } from "@/components/location-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Email</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Name</h3>
                  <p className="text-muted-foreground">{user?.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <LocationForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
