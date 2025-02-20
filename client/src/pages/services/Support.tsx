import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Support() {
  return (
    <Container>
      <h1 className="text-4xl font-bold mb-6">Support</h1>
      
      <div className="space-y-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <Input placeholder="What do you need help with?" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <Textarea 
                placeholder="Describe your issue..."
                className="min-h-[100px]"
              />
            </div>
            <Button>Submit Request</Button>
          </form>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">FAQs</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">Common questions and answers will appear here.</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
