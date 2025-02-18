
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Twitter, Facebook, Instagram } from "lucide-react";

export function SocialMediaIntegration() {
  const shareMutation = useMutation({
    mutationFn: async ({ platform, content }: { platform: string; content: string }) => {
      const response = await fetch('/api/social/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, content })
      });
      if (!response.ok) throw new Error('Failed to share');
      return response.json();
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Sharing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <Button 
            variant="outline"
            onClick={() => shareMutation.mutate({ 
              platform: 'twitter', 
              content: 'Check out this community event!' 
            })}
          >
            <Twitter className="mr-2 h-4 w-4" />
            Share on Twitter
          </Button>
          <Button 
            variant="outline"
            onClick={() => shareMutation.mutate({ 
              platform: 'facebook', 
              content: 'Check out this community event!' 
            })}
          >
            <Facebook className="mr-2 h-4 w-4" />
            Share on Facebook
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
