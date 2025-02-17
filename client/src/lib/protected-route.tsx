<<<<<<< HEAD
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
=======
import { Route, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType;
};

export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
>>>>>>> 19c724b7c93c94c7ada61db7cb86557d7bdca27b
    );
  }

  if (!user) {
<<<<<<< HEAD
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Component />
}
=======
    setLocation("/login");
    return null;
  }

  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}
>>>>>>> 19c724b7c93c94c7ada61db7cb86557d7bdca27b
