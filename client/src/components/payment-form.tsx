import { useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

// Optional Stripe configuration - payment will be disabled if keys are not provided
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

interface PaymentFormProps {
  amount: number;
  onSuccess?: () => void;
}

function CheckoutForm({ amount, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your investment!",
      });
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe}
        className="w-full bg-gold text-navy hover:bg-gold/90"
        size="lg"
      >
        Invest R{amount.toLocaleString()}
      </Button>
    </form>
  );
}

export default function PaymentForm({ amount, onSuccess }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();

  // Check if payment processing is available
  if (!stripePromise) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2" size={24} />
            Investment Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Payment Processing Unavailable</h3>
            <p className="text-gray-500 mb-4">
              Payment processing is currently being set up. Please contact us directly to complete your investment.
            </p>
            <Button variant="outline" className="bg-navy text-white hover:bg-navy/90">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const createPaymentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/create-payment-intent", { amount });
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message?.includes("not configured") 
          ? "Payment processing is not available. Please contact support."
          : "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!clientSecret && !createPaymentMutation.isPending) {
    createPaymentMutation.mutate();
  }

  if (createPaymentMutation.isPending || !clientSecret) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2" size={24} />
            Investment Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2" size={24} />
          Complete Your Investment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm amount={amount} onSuccess={onSuccess} />
        </Elements>
      </CardContent>
    </Card>
  );
}
