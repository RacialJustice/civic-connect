import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Search,
  CheckCircle2,
  XCircle,
  History,
  Users
} from "lucide-react";
import { useState } from "react";
import { type SelectEmergencyService } from "@shared/schema";

type ServiceStatus = "active" | "offline" | "maintenance" | "responding";

export default function EmergencyServicesAdmin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch emergency services with real-time status
  const { data: services = [], isLoading } = useQuery<SelectEmergencyService[]>({
    queryKey: ["/api/admin/emergency-services"],
    refetchInterval: 30000, // Refresh every 30 seconds
    enabled: !!user?.role === 'admin',
  });

  // Update service status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: ServiceStatus }) => {
      const res = await fetch(`/api/admin/emergency-services/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The service status has been successfully updated."
      });
    }
  });

  // Access log mutation
  const logAccessMutation = useMutation({
    mutationFn: async (serviceId: number) => {
      const res = await fetch(`/api/admin/emergency-services/${serviceId}/access-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user?.id,
          timestamp: new Date().toISOString()
        })
      });
      if (!res.ok) throw new Error('Failed to log access');
    }
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <p className="text-lg font-medium">Access Restricted</p>
            <p className="text-muted-foreground mt-2">
              You do not have permission to access the emergency services management system.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredServices = services.filter((service) => {
    const matchesSearch = 
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.description?.toLowerCase().includes(search.toLowerCase()) ||
      service.address.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = activeTab === "all" || service.type === activeTab;
    
    return matchesSearch && matchesType;
  });

  const serviceTypes = [
    { id: "all", label: "All Services" },
    { id: "police", label: "Police" },
    { id: "hospital", label: "Hospitals" },
    { id: "fire", label: "Fire Stations" },
    { id: "ambulance", label: "Ambulance" },
  ];

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      case "maintenance":
        return "bg-yellow-500";
      case "responding":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      {/* Header with Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Units</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter(s => s.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Responding</CardTitle>
            <History className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter(s => s.status === 'responding').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter(s => s.status === 'offline').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Personnel</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.reduce((acc, service) => acc + (service.additional_info?.personnel_count || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search emergency services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full flex-wrap h-auto p-1 gap-1">
            {serviceTypes.map((type) => (
              <TabsTrigger 
                key={type.id} 
                value={type.id}
                className="flex-1"
              >
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <Card key={service.id} className="relative overflow-hidden">
            <div 
              className={`absolute top-0 right-0 w-2 h-full ${getStatusColor(service.status as ServiceStatus)}`}
            />
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                  {service.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Contact Numbers */}
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-bold text-lg">
                      {service.phone_numbers[0]}
                    </p>
                    {service.phone_numbers.length > 1 && (
                      <p className="text-sm text-muted-foreground">
                        Alt: {service.phone_numbers[1]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 shrink-0" />
                  <div>
                    <p>{service.address}</p>
                    {service.latitude && service.longitude && (
                      <a
                        href={`https://www.google.com/maps?q=${service.latitude},${service.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center mt-1"
                      >
                        View on map
                      </a>
                    )}
                  </div>
                </div>

                {/* Operating Hours */}
                {service.operating_hours && (
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5" />
                    <p>{service.operating_hours}</p>
                  </div>
                )}

                {/* Status Controls */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => updateStatusMutation.mutate({ 
                      id: service.id, 
                      status: 'active' 
                    })}
                    disabled={service.status === 'active'}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Active
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => updateStatusMutation.mutate({ 
                      id: service.id, 
                      status: 'responding' 
                    })}
                    disabled={service.status === 'responding'}
                  >
                    <History className="h-4 w-4 mr-2" />
                    Responding
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => updateStatusMutation.mutate({ 
                      id: service.id, 
                      status: 'offline' 
                    })}
                    disabled={service.status === 'offline'}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Offline
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="text-sm text-muted-foreground">
                  <p>Personnel: {service.additional_info?.personnel_count || 'N/A'}</p>
                  <p>Last Updated: {new Date(service.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}