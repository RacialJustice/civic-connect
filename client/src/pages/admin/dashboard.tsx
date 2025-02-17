import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronUpIcon,
  Users,
  MessageSquare,
  Settings,
  Shield,
  Loader2,
} from "lucide-react";
import { formatDistance } from "date-fns";

export default function AdminDashboard() {
  const { user } = useAuth();

  // Redirect non-admin users
  if (!user || user.role !== "admin") {
    return <Redirect to="/" />;
  }

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const { data: forums, isLoading: isLoadingForums } = useQuery({
    queryKey: ["/api/admin/forums"],
  });

  if (isLoadingStats || isLoadingUsers || isLoadingForums) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage your platform and monitor activity
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newUsersToday} today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Forums</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalForums}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.totalPosts} total posts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Engagement</CardTitle>
            <ChevronUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.engagementRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              Active users / Total users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moderators</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalModerators}</div>
            <p className="text-xs text-muted-foreground">
              Managing {stats?.totalForums} forums
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="forums">Forums</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name || user.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.ward}, {user.county}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistance(new Date(user.createdAt), new Date(), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forums" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Forum Management</CardTitle>
              <CardDescription>
                Monitor and manage community forums
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Forum</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Posts</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forums?.map((forum) => (
                    <TableRow key={forum.id}>
                      <TableCell className="font-medium">
                        {forum.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {forum.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{forum._count?.posts || 0}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistance(new Date(forum.createdAt), new Date(), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>
                Configure global platform settings and policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Settings configuration coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
