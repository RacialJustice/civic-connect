
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LocalUpdatesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Local Updates</h1>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Latest Community Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Recent developments and announcements in your area.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
