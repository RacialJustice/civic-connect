import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, AlertTriangle, Heart, HelpCircle } from "lucide-react";

export function Footer() {
  const emergencyNumbers = [
    { id: 1, name: "Police", number: "999" },
    { id: 2, name: "Ambulance", number: "112" },
    { id: 3, name: "Fire", number: "999" },
    { id: 4, name: "Child Helpline", number: "116" },
    { id: 5, name: "Gender Violence", number: "1195" }
  ];

  const paymentMethods = [
    "M-Pesa",
    "Airtel Money",
    "Credit/Debit Cards",
    "Bank Transfer"
  ];

  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Emergency Contacts Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Emergency Contacts
            </h3>
            <div className="space-y-3">
              {emergencyNumbers.map((contact) => (
                <div key={contact.id} className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${contact.number}`} className="text-sm hover:underline">
                    <span className="font-medium">{contact.number}</span>
                    <span className="text-muted-foreground ml-2">({contact.name})</span>
                  </a>
                </div>
              ))}
            </div>
            <Button variant="link" asChild className="px-0">
              <Link to="/emergency-contacts">View all emergency services</Link>
            </Button>
          </div>

          {/* Donations Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Heart className="h-5 w-5 text-destructive" />
              Support Our Community
            </h3>
            <p className="text-sm text-muted-foreground">
              Your donations help fund the development of this initiative.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Accepted Payment Methods:</p>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                  <span
                    key={method}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Button className="w-full">
                <Heart className="mr-2 h-4 w-4" />
                Donate Now
              </Button>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <Button variant="link" size="sm" className="h-auto p-0">
                  Tax Information
                </Button>
                <span>•</span>
                <Button variant="link" size="sm" className="h-auto p-0">
                  Transparency Report
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/emergency-alert" className="text-sm hover:underline text-red-500 font-medium">Emergency Alert</Link>
              <Link to="/about" className="text-sm hover:underline">About Us</Link>
              <Link to="/contact" className="text-sm hover:underline">Contact</Link>
              <Link to="/privacy" className="text-sm hover:underline">Privacy Policy</Link>
              <Link to="/terms" className="text-sm hover:underline">Terms of Service</Link>
            </nav>
          </div>

          {/* Help & Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Help & Support
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Need assistance? Our support team is here to help.
              </p>
              <Button variant="outline" asChild className="w-full">
                <a href="mailto:support@civicconnect.co.ke">
                  Contact Support
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CivicConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}