import { PlaceholderContent } from "@/components/ui/placeholder-content";
import { WithLocation } from '@/components/with-location';

export default function LocalUpdatesPage() {
  return (
    <WithLocation>
      <PlaceholderContent
        title="Local Updates"
        description="Stay informed about the latest news and updates in your community. This feature is coming soon."
        icon="updates"
      />
    </WithLocation>
  );
}
