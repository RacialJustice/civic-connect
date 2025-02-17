
import { Link } from "wouter";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer">Civic Connect</h1>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <span className="text-sm">Welcome, {user.name}</span>
            ) : (
              <Link href="/auth">
                <Button variant="secondary" size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
