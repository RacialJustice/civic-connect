
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

export function DonationForm() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');

  const handleDonate = () => {
    window.FlutterwaveCheckout({
      public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: Date.now().toString(),
      amount: parseFloat(amount),
      currency: 'KES',
      payment_options: 'card,mpesa,ussd',
      customer: {
        email: user?.email || '',
        name: user?.name || '',
      },
      customizations: {
        title: 'Support Community Projects',
        description: 'Donation to support local development projects',
        logo: 'https://your-logo-url.png',
      },
      callback: function(response: any) {
        if (response.status === 'successful') {
          // Handle successful donation
          console.log('Payment complete', response);
        }
      },
      onclose: function() {
        // Handle modal close
      }
    });
  };

  return (
    <Card>
      <CardHeader>Support Community Projects</CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Donation Amount (KES)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="100"
            />
          </div>
          <Button onClick={handleDonate} className="w-full">
            Donate Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
