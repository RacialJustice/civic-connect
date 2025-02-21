import { useLocation } from '@/hooks/use-location';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WithLocationProps {
  children: React.ReactNode;
  redirectToSettings?: boolean;
}

export function WithLocation({ children, redirectToSettings = true }: WithLocationProps) {
  const { location, loading, error } = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return <div className="container mx-auto p-4">Loading location data...</div>;
  }

  if (!location) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Location Required</h2>
          <p className="text-muted-foreground mb-4">
            Please set your location to access this feature. This helps us show you relevant information for your area.
          </p>
          {redirectToSettings && (
            <Button onClick={() => navigate('/profile/settings')} className="gap-2">
              <Settings className="h-4 w-4" />
              Update Location
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
