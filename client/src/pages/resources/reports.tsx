
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Community Progress Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Latest updates on community initiatives and developments.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
