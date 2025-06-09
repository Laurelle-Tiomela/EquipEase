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
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import { useEnhancedBookings } from "@/hooks/useEnhancedSupabase";
import type {
  Equipment,
  ClientBookingForm as BookingFormType,
} from "@/lib/enhanced-types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PaymentForm } from "./PaymentForm";
import { emailService } from "../../lib/email-service";

interface ClientBookingFormProps {
  equipment?: Equipment;
  onClose?: () => void;
  isOpen?: boolean;
}

export function ClientBookingForm({
  equipment,
  onClose,
  isOpen,
}: ClientBookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { createBooking } = useEnhancedBookings();

  const [formData, setFormData] = useState<BookingFormType>({
    clientName: "",
    phone: "",
    email: "",
    profession: "",
    destination: "",
    startDate: "",
    startTime: "08:00",
    duration: 1,
    paymentMethod: "cash",
    gratitudeMessage: "",
  });

  const steps = [
    { id: 1, title: "Basic Info", icon: User },
    { id: 2, title: "Booking Details", icon: CalendarIcon },
    { id: 3, title: "Payment", icon: CreditCard },
    { id: 4, title: "Confirmation", icon: CheckCircle },
  ];

  const updateFormData = (field: keyof BookingFormType, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.clientName && formData.phone && formData.email;
      case 2:
        return (
          formData.startDate && formData.destination && formData.profession
        );
      case 3:
        return true; // Payment step handles its own validation
      default:
        return true;
    }
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    if (!equipment) return;

    setSubmitting(true);
    try {
      const bookingId = `BK${Date.now()}`;

      const bookingData = {
        ...formData,
        equipmentId: equipment.id,
        id: bookingId,
        status: "pending" as const,
        transactionId,
        paymentStatus:
          transactionId === "cash_pending"
            ? ("pending" as const)
            : ("completed" as const),
      };

      await createBooking(bookingData);

      // Send confirmation emails
      try {
        await emailService.sendBookingConfirmation(
          formData,
          equipment,
          bookingId,
        );
        await emailService.sendBookingNotification(
          formData,
          equipment,
          bookingId,
        );
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the booking if email fails
      }

      setCurrentStep(4);
      setSuccess(true);
      toast.success("Booking submitted successfully!");

      // Reset form after success
      setTimeout(() => {
        onClose?.();
        resetForm();
      }, 5000);
    } catch (error) {
      console.error("Booking submission failed:", error);
      toast.error("Booking submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      clientName: "",
      phone: "",
      email: "",
      profession: "",
      destination: "",
      startDate: "",
      startTime: "08:00",
      duration: 1,
      paymentMethod: "cash",
      gratitudeMessage: "",
    });
    setSuccess(false);
    setSubmitting(false);
  };

  if (!isOpen || !equipment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Book Equipment</CardTitle>
                <CardDescription>
                  {equipment.name} - ${equipment.dailyRate}/day
                </CardDescription>
              </div>
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ×
                </Button>
              )}
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mt-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full border-2",
                        isActive
                          ? "border-orange-500 bg-orange-500 text-white"
                          : isCompleted
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-gray-300 text-gray-400",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="ml-2">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isActive
                            ? "text-orange-600"
                            : isCompleted
                              ? "text-green-600"
                              : "text-gray-400",
                        )}
                      >
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "w-16 h-0.5 mx-4",
                          isCompleted ? "bg-green-500" : "bg-gray-300",
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="clientName"
                        placeholder="Enter your full name"
                        value={formData.clientName}
                        onChange={(e) =>
                          updateFormData("clientName", e.target.value)
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) =>
                          updateFormData("phone", e.target.value)
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="profession">Profession/Company</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="profession"
                      placeholder="e.g., Construction Company, Individual Contractor"
                      value={formData.profession}
                      onChange={(e) =>
                        updateFormData("profession", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Booking Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="destination">Delivery Destination *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="destination"
                      placeholder="Enter delivery address"
                      value={formData.destination}
                      onChange={(e) =>
                        updateFormData("destination", e.target.value)
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? (
                            format(new Date(formData.startDate), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            formData.startDate
                              ? new Date(formData.startDate)
                              : undefined
                          }
                          onSelect={(date) =>
                            updateFormData(
                              "startDate",
                              date ? format(date, "yyyy-MM-dd") : "",
                            )
                          }
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) =>
                          updateFormData("startTime", e.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration">Duration (Days)</Label>
                  <Select
                    value={formData.duration.toString()}
                    onValueChange={(value) =>
                      updateFormData("duration", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 14, 21, 30].map((days) => (
                        <SelectItem key={days} value={days.toString()}>
                          {days} {days === 1 ? "day" : "days"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="gratitudeMessage">
                    Additional Message (Optional)
                  </Label>
                  <Textarea
                    id="gratitudeMessage"
                    placeholder="Any special requests or additional information..."
                    value={formData.gratitudeMessage}
                    onChange={(e) =>
                      updateFormData("gratitudeMessage", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                {/* Booking Summary */}
                <Card className="bg-orange-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-900">
                      Booking Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-orange-800">Equipment:</span>
                      <span className="font-medium text-orange-900">
                        {equipment.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-800">Duration:</span>
                      <span className="font-medium text-orange-900">
                        {formData.duration} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-800">Daily Rate:</span>
                      <span className="font-medium text-orange-900">
                        ${equipment.dailyRate}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2 border-orange-300">
                      <span className="text-orange-900">Estimated Total:</span>
                      <span className="text-orange-900">
                        ${equipment.dailyRate * formData.duration}
                      </span>
                    </div>
                  </CardContent>
                </Card>
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
                    Thank you for choosing EquipEase. We've received your
                    booking request.
                  </p>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>What's Next?</strong>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>• You'll receive a confirmation email shortly</li>
                        <li>
                          • Our team will review your booking within 24 hours
                        </li>
                        <li>• We'll contact you to confirm delivery details</li>
                        <li>
                          • Equipment will be delivered on your selected date
                        </li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <p className="text-sm text-gray-500 mt-4">
                    Booking Reference: BK{Date.now().toString().slice(-6)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          {/* Navigation */}
          {currentStep < 3 && (
            <div className="flex justify-between p-6 border-t">
              <Button
                variant="outline"
                onClick={() =>
                  currentStep > 1
                    ? setCurrentStep(currentStep - 1)
                    : onClose?.()
                }
                disabled={submitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {currentStep > 1 ? "Previous" : "Cancel"}
              </Button>

              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!isStepValid()}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex justify-center p-6 border-t">
              <Button
                onClick={onClose}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Close
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default ClientBookingForm;
