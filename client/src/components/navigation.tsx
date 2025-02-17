import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LogOut } from "lucide-react";

export function Navigation() {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold">KenyaConnect</a>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/">
            <a className="hover:text-primary-foreground/80">Home</a>
          </Link>
          <Link href="/dashboard">
            <a className="hover:text-primary-foreground/80">Dashboard</a>
          </Link>
          
          <div className="flex items-center gap-2">
            <span>Welcome, {user?.displayName}</span>
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
