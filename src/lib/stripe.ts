import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with publishable key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_mock_key",
);

export { stripePromise };

// Payment intent creation
export const createPaymentIntent = async (
  amount: number,
  currency: string = "usd",
) => {
  try {
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to cents
        currency,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment intent");
    }

    return await response.json();
  } catch (error) {
    console.error("Payment intent creation failed:", error);
    throw error;
  }
};

// Payment processing utilities
export const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export const calculateBookingTotal = (
  dailyRate: number,
  duration: number,
  taxRate: number = 0.08,
) => {
  const subtotal = dailyRate * duration;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    subtotal,
    tax,
    total,
    breakdown: {
      dailyRate,
      duration,
      taxRate,
    },
  };
};

// Mock payment processing for development
export const mockPaymentProcess = async (
  amount: number,
): Promise<{ success: boolean; transactionId: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate random success/failure (90% success rate)
  const success = Math.random() > 0.1;

  return {
    success,
    transactionId: success ? `txn_${Date.now()}` : "",
  };
};
