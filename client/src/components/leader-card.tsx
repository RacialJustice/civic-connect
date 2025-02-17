import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function LeaderCard({ leader }: { leader: User }) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { toast } = useToast();

  const feedbackMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/leaders/${leader.id}/feedback`, {
        content: feedback,
      });
    },
    onSuccess: () => {
      toast({
        title: "Feedback sent",
        description: "Your message has been sent to the leader",
      });
      setOpen(false);
      setFeedback("");
      queryClient.invalidateQueries({ queryKey: [`/api/leaders/${leader.id}/feedback`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{leader.displayName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {leader.position} - {leader.constituency}
          </p>
          <p>{leader.bio}</p>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Send Feedback</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Feedback to {leader.displayName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Your message..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <Button
                  onClick={() => feedbackMutation.mutate()}
                  disabled={feedbackMutation.isPending}
                >
                  Send
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
