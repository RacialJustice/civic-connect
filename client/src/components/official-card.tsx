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
