import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CalendarIcon,
  Clock,
  MapPin,
  CreditCard,
  User,
  Briefcase,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { useEnhancedBookings } from "@/hooks/useEnhancedSupabase";
import type {
  Equipment,
  ClientBookingForm as BookingFormType,
} from "@/lib/enhanced-types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ClientBookingFormProps {
  equipment?: Equipment;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ClientBookingForm({
  equipment,
  onSuccess,
  onCancel,
}: ClientBookingFormProps) {
  const { submitClientBooking } = useEnhancedBookings();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState<BookingFormType>({
    client_name: "",
    phone: "",
    email: "",
    profession: "",
    destination: "",
    use_case: "",
    desired_date: "",
    desired_time: "09:00",
    duration_days: 1,
    payment_method: "card",
    gratitude_message: "",
    equipment_id: equipment?.id || "",
  });

  const professions = [
    "Construction Manager",
    "Civil Engineer",
    "Contractor",
    "Builder",
    "Architect",
    "Project Manager",
    "Equipment Operator",
    "Site Foreman",
    "Landscaper",
    "Other",
  ];

  const timeSlots = [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const calculateTotalCost = () => {
    if (!equipment) return 0;

    if (bookingData.duration_days >= 30) {
      const months = Math.ceil(bookingData.duration_days / 30);
      return months * equipment.monthly_rate;
    } else if (bookingData.duration_days >= 7) {
      const weeks = Math.ceil(bookingData.duration_days / 7);
      return weeks * equipment.weekly_rate;
    } else {
      return bookingData.duration_days * equipment.daily_rate;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      await submitClientBooking(bookingData);
      toast.success(
        "Booking submitted successfully! You will receive a confirmation email shortly.",
      );
      onSuccess?.();
    } catch (error) {
      console.error("Booking submission error:", error);
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canProceedToNextStep = () => {
    switch (step) {
      case 1:
        return (
          bookingData.client_name &&
          bookingData.email &&
          bookingData.phone &&
          bookingData.profession
        );
      case 2:
        return (
          bookingData.destination &&
          bookingData.use_case &&
          bookingData.desired_date &&
          bookingData.duration_days > 0
        );
      case 3:
        return bookingData.payment_method;
      default:
        return false;
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  step >= stepNumber
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-600",
                )}
              >
                {step > stepNumber ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  stepNumber
                )}
              </div>
              {stepNumber < 4 && (
                <div
                  className={cn(
                    "w-16 h-1 mx-2",
                    step > stepNumber ? "bg-orange-500" : "bg-gray-200",
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span
            className={
              step >= 1 ? "text-orange-600 font-medium" : "text-gray-500"
            }
          >
            Personal Info
          </span>
          <span
            className={
              step >= 2 ? "text-orange-600 font-medium" : "text-gray-500"
            }
          >
            Rental Details
          </span>
          <span
            className={
              step >= 3 ? "text-orange-600 font-medium" : "text-gray-500"
            }
          >
            Payment
          </span>
          <span
            className={
              step >= 4 ? "text-orange-600 font-medium" : "text-gray-500"
            }
          >
            Review
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Personal Information"}
            {step === 2 && "Rental Details"}
            {step === 3 && "Payment Method"}
            {step === 4 && "Review & Submit"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Please provide your contact information"}
            {step === 2 && "Tell us about your rental requirements"}
            {step === 3 && "Choose your preferred payment method"}
            {step === 4 && "Review your booking details before submitting"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="client_name"
                    className="flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Full Name *</span>
                  </Label>
                  <Input
                    id="client_name"
                    value={bookingData.client_name}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        client_name: e.target.value,
                      })
                    }
                    placeholder="John Smith"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={bookingData.email}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={bookingData.phone}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="profession"
                    className="flex items-center space-x-2"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Profession *</span>
                  </Label>
                  <Select
                    value={bookingData.profession}
                    onValueChange={(value) =>
                      setBookingData({ ...bookingData, profession: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your profession" />
                    </SelectTrigger>
                    <SelectContent>
                      {professions.map((profession) => (
                        <SelectItem key={profession} value={profession}>
                          {profession}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Rental Details */}
          {step === 2 && (
            <div className="space-y-6">
              {equipment && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg">{equipment.name}</h3>
                  <p className="text-gray-600">{equipment.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span>Daily: {formatCurrency(equipment.daily_rate)}</span>
                    <span>Weekly: {formatCurrency(equipment.weekly_rate)}</span>
                    <span>
                      Monthly: {formatCurrency(equipment.monthly_rate)}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <Label
                  htmlFor="destination"
                  className="flex items-center space-x-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Destination/Job Site *</span>
                </Label>
                <Input
                  id="destination"
                  value={bookingData.destination}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      destination: e.target.value,
                    })
                  }
                  placeholder="123 Construction Site, City, State"
                  required
                />
              </div>

              <div>
                <Label htmlFor="use_case">Use Case/Project Description *</Label>
                <Textarea
                  id="use_case"
                  value={bookingData.use_case}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, use_case: e.target.value })
                  }
                  placeholder="Describe what you'll be using the equipment for..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Desired Date *</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !bookingData.desired_date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bookingData.desired_date
                          ? format(new Date(bookingData.desired_date), "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          bookingData.desired_date
                            ? new Date(bookingData.desired_date)
                            : undefined
                        }
                        onSelect={(date) =>
                          setBookingData({
                            ...bookingData,
                            desired_date: date
                              ? date.toISOString().split("T")[0]
                              : "",
                          })
                        }
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Preferred Time</span>
                  </Label>
                  <Select
                    value={bookingData.desired_time}
                    onValueChange={(value) =>
                      setBookingData({ ...bookingData, desired_time: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration_days">Duration (Days) *</Label>
                  <Input
                    id="duration_days"
                    type="number"
                    min="1"
                    value={bookingData.duration_days}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        duration_days: parseInt(e.target.value) || 1,
                      })
                    }
                    required
                  />
                </div>
              </div>

              {/* Cost Preview */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800">
                  Estimated Cost
                </h4>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(calculateTotalCost())}
                </div>
                <p className="text-sm text-orange-700">
                  For {bookingData.duration_days} day
                  {bookingData.duration_days !== 1 ? "s" : ""} rental
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <PaymentForm
              bookingData={formData}
              equipment={equipment}
              onPaymentSuccess={handlePaymentSuccess}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && success && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Booking Submitted Successfully!
                </h3>
                <p className="text-gray-600 mb-4">
                  Thank you for choosing EquipEase. We've received your booking request.
                </p>

                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1 text-left">
                    <li>• You'll receive a confirmation email shortly</li>
                    <li>• Our team will review your booking within 24 hours</li>
                    <li>• We'll contact you to confirm delivery details</li>
                    <li>• Equipment will be delivered on your selected date</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-500">
                  Booking Reference: BK{Date.now().toString().slice(-6)}
                </p>
              </div>
            </div>
          )}
                      value: "bank_transfer",
                      label: "Bank Transfer",
                      icon: "🏦",
                    },
                    { value: "cash", label: "Cash", icon: "💵" },
                    { value: "check", label: "Check", icon: "📝" },
                  ].map((method) => (
                    <div
                      key={method.value}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-colors",
                        bookingData.payment_method === method.value
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          payment_method: method.value as any,
                        })
                      }
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">{method.icon}</div>
                        <div className="text-sm font-medium">
                          {method.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="gratitude_message">
                  Gratitude Message (Optional)
                </Label>
                <Textarea
                  id="gratitude_message"
                  value={bookingData.gratitude_message}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      gratitude_message: e.target.value,
                    })
                  }
                  placeholder="Thank you for providing excellent service! Looking forward to working with you."
                  rows={3}
                />
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Payment will be processed upon booking approval. You will
                  receive an invoice via email.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Name:</strong> {bookingData.client_name}
                    </div>
                    <div>
                      <strong>Email:</strong> {bookingData.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {bookingData.phone}
                    </div>
                    <div>
                      <strong>Profession:</strong> {bookingData.profession}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Rental Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Equipment:</strong> {equipment?.name}
                    </div>
                    <div>
                      <strong>Destination:</strong> {bookingData.destination}
                    </div>
                    <div>
                      <strong>Date:</strong> {bookingData.desired_date} at{" "}
                      {bookingData.desired_time}
                    </div>
                    <div>
                      <strong>Duration:</strong> {bookingData.duration_days} day
                      {bookingData.duration_days !== 1 ? "s" : ""}
                    </div>
                    <div>
                      <strong>Payment:</strong>{" "}
                      {bookingData.payment_method
                        .replace("_", " ")
                        .toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Use Case</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {bookingData.use_case}
                </p>
              </div>

              {bookingData.gratitude_message && (
                <div>
                  <h4 className="font-semibold">Your Message</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {bookingData.gratitude_message}
                  </p>
                </div>
              )}

              <div className="bg-orange-50 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Cost:</span>
                  <span className="text-3xl font-bold text-orange-600">
                    {formatCurrency(calculateTotalCost())}
                  </span>
                </div>
                <p className="text-sm text-orange-700 mt-1">
                  Subject to approval and final confirmation
                </p>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your booking will be submitted for approval. You'll receive a
                  confirmation email within 24 hours.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <div>
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              )}
              {onCancel && (
                <Button variant="ghost" onClick={onCancel} className="ml-2">
                  Cancel
                </Button>
              )}
            </div>

            <div>
              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceedToNextStep()}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Booking"
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}