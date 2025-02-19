import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Search, 
  Printer,
  Languages,
  BookmarkPlus,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import { type SelectEmergencyService } from "@shared/schema";

export default function EmergencyContactsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState<"en" | "sw">("en");
  const [activeTab, setActiveTab] = useState("all");

  const { data: services = [], isLoading } = useQuery<SelectEmergencyService[]>({
    queryKey: ["/api/emergency-services", user?.ward, user?.constituency, user?.county],
    enabled: !!user,
  });

  const filteredServices = services.filter((service) => {
    const matchesSearch = 
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.description?.toLowerCase().includes(search.toLowerCase()) ||
      service.address.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = activeTab === "all" || service.type === activeTab;
    
    return matchesSearch && matchesType;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSaveContact = async (service: SelectEmergencyService) => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        // @ts-ignore - ContactsManager API
        const props = ['name', 'tel', 'address'];
        const supported = await navigator.contacts.getProperties();
        if (supported.includes(...props)) {
          const contact = {
            name: [service.name],
            tel: [service.phone_numbers[0]],
            address: [service.address],
          };
          // @ts-ignore - ContactsManager API
          await navigator.contacts.select(props);
          toast({
            title: "Contact Saved",
            description: "Emergency contact has been added to your contacts.",
          });
        }
      } catch (err) {
        console.error('Failed to save contact:', err);
      }
    }
  };

  const emergencyTypes = [
    { id: "all", label: language === "en" ? "All Services" : "Huduma Zote" },
    { id: "police", label: language === "en" ? "Police" : "Polisi" },
    { id: "hospital", label: language === "en" ? "Hospitals" : "Hospitali" },
    { id: "fire", label: language === "en" ? "Fire Stations" : "Vituo vya Zimamoto" },
    { id: "ambulance", label: language === "en" ? "Ambulance" : "Ambulensi" },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      {/* Language Toggle */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(l => l === "en" ? "sw" : "en")}
          className="print:hidden"
        >
          <Languages className="h-4 w-4 mr-2" />
          {language === "en" ? "Kiswahili" : "English"}
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-destructive">
          {language === "en" ? "Emergency Contacts" : "Nambari za Dharura"}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {language === "en" 
            ? "Quick access to emergency services in your area" 
            : "Nambari za huduma za dharura katika eneo lako"}
        </p>
      </div>

      {/* Emergency Alert Banner */}
      <Card className="mb-6 bg-destructive text-destructive-foreground print:bg-white print:border-2 print:border-destructive">
        <CardContent className="py-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-medium">
              {language === "en" 
                ? "For immediate emergencies, always dial 999 or 112" 
                : "Kwa dharura, piga 999 au 112"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Print and Search Controls */}
      <div className="mb-6 space-y-4 print:hidden">
        <div className="flex gap-4">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            {language === "en" ? "Print List" : "Chapisha Orodha"}
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={language === "en" ? "Search emergency services..." : "Tafuta huduma za dharura..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full flex-wrap h-auto p-1 gap-1">
            {emergencyTypes.map((type) => (
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

      {/* Services List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <Card key={service.id} className="relative overflow-hidden">
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
                {/* Emergency Number */}
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-bold text-lg">
                      {service.phone_numbers[0]}
                    </p>
                    {service.phone_numbers.length > 1 && (
                      <p className="text-sm text-muted-foreground">
                        {language === "en" ? "Alt: " : "Mbadala: "}
                        {service.phone_numbers[1]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
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
                        {language === "en" ? "View on map" : "Angalia kwenye ramani"}
                        <ExternalLink className="h-3 w-3 ml-1" />
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

                {/* Description */}
                {service.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {service.description}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 print:hidden">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleSaveContact(service)}
                  >
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    {language === "en" ? "Save Contact" : "Hifadhi Anwani"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <a href={`tel:${service.phone_numbers[0]}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      {language === "en" ? "Call Now" : "Piga Simu"}
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Print-specific content */}
      <div className="hidden print:block mt-8">
        <p className="text-sm text-muted-foreground">
          {language === "en" 
            ? "Printed on: " + new Date().toLocaleDateString() 
            : "Ilichapishwa: " + new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}