import { EmergencyAlertForm } from "@/components/emergency/alert-form";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";

export default function EmergencyAlertPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Please sign in to access the emergency alert system.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <EmergencyAlertForm />
    </div>
  );
}