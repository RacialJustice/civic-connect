import { Header } from "@/components/header";
import { LocationForm } from "@/components/location-form";
import { LocalUpdates } from "@/components/local-updates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user } = useAuth();
  
  return (
    <div>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[300px,1fr]">
          {!user?.constituency && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <LocationForm />
                </CardContent>
              </Card>
            </div>
          )}

          <div className={user?.constituency ? "" : "lg:col-start-2"}>
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Bell className="h-5 w-5 text-primary" />
                <h1 className="text-2xl font-bold">Latest Updates</h1>
              </div>
              <LocalUpdates />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}