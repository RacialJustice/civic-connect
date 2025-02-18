
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

  const [paymentMethod, setPaymentMethod] = useState<'flutterwave' | 'mpesa'>('flutterwave');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleMpesaPayment = async () => {
    try {
      const response = await fetch('/api/donations/mpesa/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          phoneNumber,
          reference: Date.now().toString(),
        }),
      });
      
      const result = await response.json();
      if (result.ResponseCode === '0') {
        alert('Please check your phone for the STK push prompt');
      } else {
        alert('Failed to initiate payment. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const handleDonate = () => {
    if (paymentMethod === 'mpesa') {
      handleMpesaPayment();
      return;
    }

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
          <div>
            <Label htmlFor="payment-method">Payment Method</Label>
            <select 
              id="payment-method"
              className="w-full p-2 border rounded"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'flutterwave' | 'mpesa')}
            >
              <option value="flutterwave">Flutterwave (Card/MPesa)</option>
              <option value="mpesa">Direct MPesa</option>
            </select>
          </div>
          {paymentMethod === 'mpesa' && (
            <div>
              <Label htmlFor="phone">MPesa Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="254700000000"
              />
            </div>
          )}
          <Button onClick={handleDonate} className="w-full">
            Donate Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
