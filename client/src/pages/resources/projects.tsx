
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Development Projects</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Ongoing Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Current development initiatives in your community.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
