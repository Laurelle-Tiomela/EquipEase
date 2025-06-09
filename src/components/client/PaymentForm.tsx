import React, { useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  stripePromise,
  calculateBookingTotal,
  formatCurrency,
  mockPaymentProcess,
} from "../../lib/stripe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { Equipment } from "@/lib/enhanced-types";

interface PaymentFormData {
  clientName: string;
  phone: string;
  email: string;
  profession: string;
  destination: string;
  startDate: string;
  startTime: string;
  duration: number;
  paymentMethod: "cash" | "card";
  gratitudeMessage: string;
}

interface PaymentFormProps {
  bookingData: PaymentFormData;
  equipment: Equipment;
  onPaymentSuccess: (transactionId: string) => void;
  onBack: () => void;
}

const PaymentFormContent: React.FC<PaymentFormProps> = ({
  bookingData,
  equipment,
  onPaymentSuccess,
  onBack,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");

  // Calculate pricing
  const pricing = calculateBookingTotal(
    equipment.dailyRate,
    bookingData.duration || 1,
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      if (paymentMethod === "cash") {
        // Handle cash payment (just mark as pending)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        onPaymentSuccess("cash_pending");
        return;
      }

      // For development, use mock payment
      const result = await mockPaymentProcess(pricing.total);

      if (result.success) {
        onPaymentSuccess(result.transactionId);
      } else {
        setError("Payment failed. Please try again.");
      }

      // Real Stripe implementation would be:
      /*
      if (!stripe || !elements) {
        setError('Stripe not loaded');
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('Card element not found');
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: bookingData.clientName,
          email: bookingData.email,
        },
      });

      if (error) {
        setError(error.message || 'Payment failed');
        return;
      }

      // Process payment with backend
      const paymentResult = await createPaymentIntent(pricing.total);
      // ... handle payment confirmation
      */
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">{equipment.name}</p>
              <p className="text-gray-600">{equipment.category}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatCurrency(equipment.dailyRate)}/day
              </p>
              <p className="text-gray-600">{bookingData.duration} days</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(pricing.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%):</span>
              <span>{formatCurrency(pricing.tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{formatCurrency(pricing.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                paymentMethod === "card"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">Credit Card</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Pay now with card</p>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("cash")}
              className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                paymentMethod === "cash"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Cash on Delivery</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Pay when equipment arrives
              </p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>
              {paymentMethod === "card" ? "Card Details" : "Confirm Booking"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethod === "card" && (
              <>
                <div className="p-4 border rounded-lg">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="h-4 w-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </>
            )}

            {paymentMethod === "cash" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Cash on Delivery</span>
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  You'll pay {formatCurrency(pricing.total)} when the equipment
                  is delivered. Our team will contact you to confirm the
                  delivery details.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Payment Error</span>
                </div>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={processing}
                className="flex-1"
              >
                Back
              </Button>

              <Button type="submit" disabled={processing} className="flex-1">
                {processing
                  ? "Processing..."
                  : paymentMethod === "card"
                    ? `Pay ${formatCurrency(pricing.total)}`
                    : "Confirm Booking"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  );
};
