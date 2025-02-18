import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectUser } from "@shared/schema";
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export function UserManagement() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery<SelectUser[]>({
    queryKey: ['/api/users', search],
  });

  const mutation = useMutation({
    mutationFn: async ({ userId, action }: { userId: number, action: string }) => {
      const response = await fetch(`/api/users/${userId}/${action}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to perform action');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Action completed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to perform action",
        variant: "destructive",
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Input 
          placeholder="Search users..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />
        <div className="space-y-4">
          {users?.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded">
              <div>
                <h4 className="font-medium">{user.name}</h4>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => mutation.mutate({ userId: user.id, action: 'suspend' })}
                  disabled={mutation.isPending}
                >
                  Suspend
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => mutation.mutate({ userId: user.id, action: 'reset-password' })}
                  disabled={mutation.isPending}
                >
                  Reset Password
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}