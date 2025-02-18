import { useAuth } from "@/hooks/use-auth";
import { PointsDisplay } from "@/components/gamification/points-display";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Existing profile information */}
        </div>
        
        <div>
          <PointsDisplay userId={user.id} />
        </div>
      </div>
    </div>
  );
}
