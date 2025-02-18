import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

export function PollCreator() {
  const { user } = useAuth();
  // ... rest of the PollCreator component remains unchanged ...
}