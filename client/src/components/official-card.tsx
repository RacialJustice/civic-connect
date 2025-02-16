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