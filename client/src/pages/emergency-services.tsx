import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface EmergencyService {
  id: number;
  name: string;
  phone: string;
  type: string;
  available24h: boolean;
  location: string;
}

export default function EmergencyServicesPage() {
  const { data: services, isLoading } = useQuery<EmergencyService[]>({
    queryKey: ["/api/emergency-services"],
  });

  if (isLoading) {
    return <div>Loading emergency services...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Emergency Services</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services?.map((service) => (
          <Card key={service.id} className="bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                {service.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{service.location}</p>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => window.location.href = `tel:${service.phone}`}
              >
                <Phone className="w-4 h-4 mr-2" />
                {service.phone}
              </Button>
              {service.available24h && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Available 24/7
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
