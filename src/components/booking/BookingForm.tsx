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
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Phone, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useEquipment, useClients, useBookings } from "@/hooks/useSupabase";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function BookingForm() {
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
  });
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { equipment, loading: equipmentLoading } = useEquipment();
  const { addClient } = useClients();
  const { addBooking } = useBookings();

  const selectedEquipmentData = equipment.find(
    (eq) => eq.id === selectedEquipment,
  );

  const calculateTotal = () => {
    if (!selectedEquipmentData || !startDate || !endDate) return 0;

    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (days >= 30) {
      const months = Math.ceil(days / 30);
      return months * selectedEquipmentData.monthly_rate;
    } else if (days >= 7) {
      const weeks = Math.ceil(days / 7);
      return weeks * selectedEquipmentData.weekly_rate;
    } else {
      return days * selectedEquipmentData.daily_rate;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEquipment || !startDate || !endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      // First, add or find the client
      const clientData = {
        name: clientInfo.name,
        email: clientInfo.email,
        phone: clientInfo.phone,
        company: clientInfo.company,
        address: clientInfo.address,
        registration_date: new Date().toISOString().split("T")[0],
        is_online: false,
        last_seen: new Date().toISOString(),
      };

      const client = await addClient(clientData);

      // Then create the booking
      const bookingData = {
        client_id: client.id,
        equipment_id: selectedEquipment,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        status: "pending" as const,
        total_amount: calculateTotal(),
        notes: notes || undefined,
      };

      await addBooking(bookingData);

      toast.success(
        "Booking submitted successfully! We will contact you shortly.",
      );

      // Reset form
      setSelectedEquipment("");
      setStartDate(undefined);
      setEndDate(undefined);
      setClientInfo({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
      });
      setNotes("");
    } catch (error) {
      console.error("Booking submission error:", error);
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (equipmentLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Equipment Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Equipment</CardTitle>
          <CardDescription>
            Choose from our available construction equipment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {equipment.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No equipment available at the moment. Please check back later.
            </p>
          ) : (
            equipment.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "p-4 border rounded-lg cursor-pointer transition-colors",
                  selectedEquipment === item.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300",
                  item.availability !== "available" &&
                    "opacity-50 cursor-not-allowed",
                )}
                onClick={() => {
                  if (item.availability === "available") {
                    setSelectedEquipment(item.id);
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>Daily: ${item.daily_rate}</span>
                        <span>Weekly: ${item.weekly_rate}</span>
                        <span>Monthly: ${item.monthly_rate}</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      item.availability === "available"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      item.availability === "available" ? "bg-green-500" : ""
                    }
                  >
                    {item.availability}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>
            Fill in your information and rental period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Information */}
            <div className="space-y-4">
              <h4 className="font-medium">Client Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={clientInfo.name}
                    onChange={(e) =>
                      setClientInfo({ ...clientInfo, name: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientInfo.email}
                    onChange={(e) =>
                      setClientInfo({ ...clientInfo, email: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={clientInfo.phone}
                    onChange={(e) =>
                      setClientInfo({ ...clientInfo, phone: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={clientInfo.company}
                    onChange={(e) =>
                      setClientInfo({ ...clientInfo, company: e.target.value })
                    }
                    disabled={submitting}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={clientInfo.address}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, address: e.target.value })
                  }
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Rental Period */}
            <div className="space-y-4">
              <h4 className="font-medium">Rental Period</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={submitting}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={submitting}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special requirements or delivery instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={submitting}
              />
            </div>

            {/* Total Cost */}
            {selectedEquipmentData && startDate && endDate && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Cost:</span>
                  <span className="text-2xl font-bold text-orange-600">
                    ${calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                type="submit"
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                disabled={
                  !selectedEquipment || !startDate || !endDate || submitting
                }
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
              <Button
                variant="outline"
                className="flex items-center space-x-2"
                type="button"
              >
                <Phone className="w-4 h-4" />
                <span>Call to Discuss</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
