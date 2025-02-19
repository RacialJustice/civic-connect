import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Permits = () => {
  return (
    <Container>
      <h1 className="text-4xl font-bold mb-6">Permits & Licenses</h1>
      
      <div className="space-y-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Apply for a Permit</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Permit Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select permit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="building">Building Permit</SelectItem>
                  <SelectItem value="business">Business License</SelectItem>
                  <SelectItem value="event">Event Permit</SelectItem>
                  <SelectItem value="parking">Parking Permit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Start Application</Button>
          </form>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Active Permits</h2>
          <p className="text-muted-foreground">No active permits found.</p>
        </div>
      </div>
    </Container>
  );
};
