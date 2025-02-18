
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectUser } from "@shared/schema";
import { useState } from "react";

export function UserManagement() {
  const [search, setSearch] = useState("");
  
  const { data: users, isLoading } = useQuery<SelectUser[]>({
    queryKey: ['/api/users', search],
  });

  const mutation = useMutation({
    mutationFn: async ({ userId, action }: { userId: number, action: string }) => {
      const response = await fetch(`/api/users/${userId}/${action}`, {
        method: 'POST',
      });
      return response.json();
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
                >
                  Suspend
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => mutation.mutate({ userId: user.id, action: 'reset-password' })}
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
