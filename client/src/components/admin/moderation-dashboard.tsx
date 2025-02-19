import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ModerationMetrics } from "./moderation-metrics";
import { AuditLog } from "./audit-log";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export function ModerationDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedModerator, setSelectedModerator] = useState<any>(null);

  // Fetch moderators
  const { data: moderators = [], isLoading: isLoadingModerators } = useQuery({
    queryKey: ['/api/moderators'],
    enabled: user?.role === 'admin'
  });

  // Fetch pending content
  const { data: pendingContent = [], isLoading: isLoadingContent } = useQuery({
    queryKey: ['/api/moderation/queue'],
    enabled: user?.role === 'admin'
  });

  // Add moderator mutation
  const addModeratorMutation = useMutation({
    mutationFn: async (data: { email: string, permissions: string[] }) => {
      const res = await fetch('/api/moderators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to add moderator');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Moderator invited",
        description: "A verification email has been sent to the moderator."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Remove moderator mutation
  const removeModeratorMutation = useMutation({
    mutationFn: async (moderatorId: string) => {
      const res = await fetch(`/api/moderators/${moderatorId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to remove moderator');
    },
    onSuccess: () => {
      toast({
        title: "Moderator removed",
        description: "The moderator permissions have been revoked."
      });
      setSelectedModerator(null);
    }
  });

  if (!user || user.role !== 'admin') {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            You do not have permission to access the moderation dashboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <ModerationMetrics />

      {/* Moderators Section */}
      <Card>
        <CardHeader>
          <CardTitle>Moderators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add Moderator Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                
                // Validate email
                if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                  toast({
                    title: "Invalid email",
                    description: "Please enter a valid email address",
                    variant: "destructive"
                  });
                  return;
                }

                addModeratorMutation.mutate({ 
                  email,
                  permissions: ['moderate_content', 'manage_users']
                });
                form.reset();
              }}
              className="flex gap-4 mb-6"
            >
              <Input 
                name="email"
                type="email" 
                placeholder="Moderator email"
                required
              />
              <Button type="submit" disabled={addModeratorMutation.isPending}>
                Add Moderator
              </Button>
            </form>

            {/* Moderators List */}
            <div className="space-y-4">
              {moderators.map((mod: any) => (
                <div key={mod.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{mod.email}</p>
                    <div className="flex gap-2 mt-1">
                      {mod.permissions.map((perm: string) => (
                        <Badge key={perm} variant="secondary">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedModerator(mod)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <AuditLog />

      {/* Confirmation Dialog */}
      <AlertDialog 
        open={!!selectedModerator} 
        onOpenChange={() => setSelectedModerator(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Moderator</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedModerator?.email} as a moderator? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => removeModeratorMutation.mutate(selectedModerator.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}