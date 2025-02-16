import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function EducationalResources() {
  const { data: resources, isLoading } = useQuery<any[]>({
    queryKey: ["/api/resources"],
  });

  const categories = ["government", "voting", "civic"];

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Educational Resources</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Learn about your government, voting process, and civic engagement
        </p>
      </div>

      <Tabs defaultValue="government">
        <TabsList>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-6">
              {resources
                ?.filter((resource) => resource.category === category)
                .map((resource) => (
                  <Card key={resource.id}>
                    <CardHeader>
                      <CardTitle>{resource.title}</CardTitle>
                      <CardDescription>
                        {new Date(resource.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: resource.content }}
                      />
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
