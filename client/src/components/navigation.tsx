import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LogOut } from "lucide-react";

export function Navigation() {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="text-2xl font-bold cursor-pointer">
          <Link href="/">KenyaConnect</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/">
            <span className="hover:text-primary-foreground/80 cursor-pointer">Home</span>
          </Link>
          <Link href="/dashboard">
            <span className="hover:text-primary-foreground/80 cursor-pointer">Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <span>Welcome, {user?.name || 'User'}</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}