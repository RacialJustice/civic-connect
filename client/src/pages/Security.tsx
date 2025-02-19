import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Security = () => {
  return (
    <Container>
      <h1 className="text-4xl font-bold mb-6">Security Settings</h1>
      
      <div className="space-y-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <Input type="password" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <Input type="password" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <Input type="password" />
            </div>
            <Button>Update Password</Button>
          </form>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Two-Factor Authentication</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Add an extra layer of security to your account by enabling two-factor authentication.
          </p>
          <Button variant="outline">Enable 2FA</Button>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Login History</h2>
          <p className="text-sm text-muted-foreground">
            View your recent login activity
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Security;
