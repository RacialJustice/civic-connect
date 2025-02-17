<<<<<<< HEAD
import { SelectOfficial } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface OfficialCardProps {
  official: SelectOfficial;
}

export function OfficialCard({ official }: OfficialCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          {official.photo ? (
            <img src={official.photo} alt={official.name} />
          ) : (
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h3 className="font-semibold">{official.name}</h3>
          <p className="text-sm text-muted-foreground">{official.role}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{official.level}</Badge>
            {official.party && <Badge variant="secondary">{official.party}</Badge>}
          </div>
          <p className="text-sm">
            {[
              official.ward,
              official.constituency,
              official.county
            ].filter(Boolean).join(", ")}
          </p>
          {official.email && (
            <p className="text-sm text-muted-foreground">
              {official.email}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
=======
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type SelectOfficial } from "@db/schema";
import { Mail, Phone } from "lucide-react";

export function OfficialCard({ official }: { official: SelectOfficial }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 bg-gradient-to-b from-primary/10 to-background">
          <Avatar className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-24 w-24">
            <AvatarImage src={official.photo} alt={official.name} />
            <AvatarFallback>{official.name[0]}</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="pt-14 text-center">
        <h3 className="text-xl font-semibold">{official.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{official.role}</p>

        <div className="flex justify-center gap-2 mt-2">
          <Badge variant="secondary">{official.level}</Badge>
          {official.party && <Badge>{official.party}</Badge>}
        </div>

        <div className="mt-4 space-y-2">
          {official.email && (
            <Button variant="outline" className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          )}
          {official.phone && (
            <Button variant="outline" className="w-full">
              <Phone className="mr-2 h-4 w-4" />
              Call
            </Button>
          )}
        </div>

        <div className="mt-4 text-sm">
          <p className="font-medium">Term</p>
          <p className="text-muted-foreground">
            {new Date(official.termStart!).getFullYear()} - {new Date(official.termEnd!).getFullYear()}
          </p>
        </div>
        {official.type === 'mp' && (
          <div className="space-y-1 mt-2">
            {official.county && (
              <p className="text-sm text-muted-foreground">
                County: {official.county}
              </p>
            )}
            {official.constituency && (
              <p className="text-sm text-muted-foreground">
                Constituency: {official.constituency}
              </p>
            )}
            {official.party && (
              <p className="text-sm text-muted-foreground">
                Party: {official.party}
              </p>
            )}
            {official.status && (
              <p className="text-sm text-muted-foreground">
                Status: {official.status}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
>>>>>>> 19c724b7c93c94c7ada61db7cb86557d7bdca27b
