import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user } = useAuth();

  if (!user?.role?.includes('admin')) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
