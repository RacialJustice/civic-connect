import { Button } from "@/components/ui/button";
import { PhoneCall, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export function EmergencyAlert() {
  return (
    <div className="bg-red-500 text-white">
      <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">Emergency? Get immediate assistance</span>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 sm:flex-initial"
            asChild
          >
            <Link to="/emergency-contacts">
              <PhoneCall className="mr-2 h-4 w-4" />
              Emergency Contacts
            </Link>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 sm:flex-initial"
            asChild
          >
            <a href="tel:911">
              <PhoneCall className="mr-2 h-4 w-4" />
              Call 911
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
