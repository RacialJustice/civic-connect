import { Container } from "@/components/ui/container";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function PollsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("active");

  if (!user?.constituency) {
    return (
      <Container>
        <div className="py-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Community Polls</h1>
          <p className="text-muted-foreground">
            Please set your constituency in your profile to see local polls.
          </p>
          <Button className="mt-4" variant="default" asChild>
            <a href="/profile/settings">Update Profile</a>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Polls & Surveys</h1>
          <Button variant="default">Create Poll</Button>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <Card className="bg-card hover:bg-accent/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Active Polls</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Participate in current community polls and make your voice heard.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card className="bg-card hover:bg-accent/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Recent Survey Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View outcomes from recent community surveys and polls.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            <Card className="bg-card hover:bg-accent/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Draft Polls</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Continue working on your drafted polls.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}