import { Container } from "@/components/ui/container";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const Notifications = () => {
  return (
    <Container>
      <h1 className="text-4xl font-bold mb-6">Notifications</h1>
      
      <div className="space-y-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Community Updates</p>
                <p className="text-sm text-muted-foreground">Receive updates about your community</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Event Reminders</p>
                <p className="text-sm text-muted-foreground">Get notified about upcoming events</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Survey Notifications</p>
                <p className="text-sm text-muted-foreground">Be notified when new surveys are available</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">No new notifications</p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Notifications;
