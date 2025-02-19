import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Payments = () => {
  return (
    <Container>
      <h1 className="text-4xl font-bold mb-6">Payments</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pay Bills</CardTitle>
            <CardDescription>Pay utility bills, taxes, and fees</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Make a Payment</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>View your recent payments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent payments</p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};
