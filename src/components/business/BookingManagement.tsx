import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Edit,
  FileText,
  Download,
  Filter,
  Search,
  MoreVertical,
  AlertTriangle,
} from "lucide-react";
import { useEnhancedBookings } from "@/hooks/useEnhancedSupabase";
import type { Booking, FilterOptions } from "@/lib/enhanced-types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function BookingManagement() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const { bookings, loading, approveBooking, rejectBooking } =
    useEnhancedBookings({
      status: filterStatus === "all" ? undefined : (filterStatus as any),
    });

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.equipment?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.destination?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleApproveBooking = async (booking: any) => {
    try {
      await approveBooking(booking.id, adminNotes);
      toast.success("Booking approved successfully");
      setSelectedBooking(null);
      setAdminNotes("");
    } catch (error) {
      toast.error("Failed to approve booking");
    }
  };

  const handleRejectBooking = async (booking: any) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await rejectBooking(booking.id, rejectionReason);
      toast.success("Booking rejected");
      setSelectedBooking(null);
      setRejectionReason("");
    } catch (error) {
      toast.error("Failed to reject booking");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", label: "Pending Review" },
      approved: { color: "bg-blue-500", label: "Approved" },
      rejected: { color: "bg-red-500", label: "Rejected" },
      active: { color: "bg-green-500", label: "Active" },
      completed: { color: "bg-gray-500", label: "Completed" },
      cancelled: { color: "bg-red-400", label: "Cancelled" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-400",
      label: status,
    };

    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", label: "Payment Pending" },
      partial: { color: "bg-orange-500", label: "Partially Paid" },
      paid: { color: "bg-green-500", label: "Paid" },
      refunded: { color: "bg-gray-500", label: "Refunded" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-400",
      label: status,
    };

    return (
      <Badge variant="outline" className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  const bookingStats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    approved: bookings.filter((b) => b.status === "approved").length,
    active: bookings.filter((b) => b.status === "active").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Booking Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {bookingStats.total}
            </div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {bookingStats.pending}
            </div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {bookingStats.approved}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {bookingStats.active}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {bookingStats.completed}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Booking Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by client, equipment, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
          <CardDescription>
            Manage and review equipment rental bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">
                No bookings found
              </h3>
              <p className="text-gray-500">
                No bookings match your current filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking: any) => (
                <Card
                  key={booking.id}
                  className={cn(
                    "transition-colors hover:bg-gray-50",
                    booking.status === "pending" &&
                      "border-yellow-200 bg-yellow-50",
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.equipment?.name || "Unknown Equipment"}
                            </h3>
                            <p className="text-gray-600">
                              Booked by{" "}
                              {booking.clients?.name || "Unknown Client"}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(booking.status)}
                            {getPaymentStatusBadge(
                              booking.payment_status || "pending",
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="font-medium">Rental Period</div>
                              <div className="text-gray-600">
                                {formatDate(booking.start_date)} -{" "}
                                {formatDate(booking.end_date)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="font-medium">Duration</div>
                              <div className="text-gray-600">
                                {booking.duration_days} day
                                {booking.duration_days !== 1 ? "s" : ""}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="font-medium">Destination</div>
                              <div className="text-gray-600 truncate">
                                {booking.destination}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div>
                              <div className="font-medium">Total Amount</div>
                              <div className="text-lg font-bold text-green-600">
                                {formatCurrency(booking.total_amount)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{booking.clients?.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{booking.clients?.phone}</span>
                          </div>
                        </div>

                        {booking.use_case && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-medium text-sm mb-1">
                              Use Case:
                            </div>
                            <div className="text-sm text-gray-600">
                              {booking.use_case}
                            </div>
                          </div>
                        )}

                        {booking.gratitude_message && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="font-medium text-sm mb-1">
                              Client Message:
                            </div>
                            <div className="text-sm text-blue-700">
                              {booking.gratitude_message}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Booking Details</DialogTitle>
                              <DialogDescription>
                                Review and manage this booking
                              </DialogDescription>
                            </DialogHeader>

                            {selectedBooking && (
                              <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold mb-3">
                                      Client Information
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div>
                                        <strong>Name:</strong>{" "}
                                        {selectedBooking.clients?.name}
                                      </div>
                                      <div>
                                        <strong>Email:</strong>{" "}
                                        {selectedBooking.clients?.email}
                                      </div>
                                      <div>
                                        <strong>Phone:</strong>{" "}
                                        {selectedBooking.clients?.phone}
                                      </div>
                                      <div>
                                        <strong>Company:</strong>{" "}
                                        {selectedBooking.clients?.company ||
                                          "N/A"}
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-3">
                                      Equipment & Rental Details
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div>
                                        <strong>Equipment:</strong>{" "}
                                        {selectedBooking.equipment?.name}
                                      </div>
                                      <div>
                                        <strong>Start Date:</strong>{" "}
                                        {formatDate(selectedBooking.start_date)}
                                      </div>
                                      <div>
                                        <strong>End Date:</strong>{" "}
                                        {formatDate(selectedBooking.end_date)}
                                      </div>
                                      <div>
                                        <strong>Duration:</strong>{" "}
                                        {selectedBooking.duration_days} day
                                        {selectedBooking.duration_days !== 1
                                          ? "s"
                                          : ""}
                                      </div>
                                      <div>
                                        <strong>Total Amount:</strong>{" "}
                                        <span className="text-green-600 font-bold">
                                          {formatCurrency(
                                            selectedBooking.total_amount,
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {selectedBooking.status === "pending" && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="admin_notes">
                                        Admin Notes (Optional)
                                      </Label>
                                      <Textarea
                                        id="admin_notes"
                                        value={adminNotes}
                                        onChange={(e) =>
                                          setAdminNotes(e.target.value)
                                        }
                                        placeholder="Add any notes for this booking..."
                                        rows={3}
                                      />
                                    </div>

                                    <div className="flex space-x-4">
                                      <Button
                                        onClick={() =>
                                          handleApproveBooking(selectedBooking)
                                        }
                                        className="flex-1 bg-green-500 hover:bg-green-600"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve Booking
                                      </Button>

                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            variant="destructive"
                                            className="flex-1"
                                          >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Reject Booking
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Reject Booking
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Please provide a reason for
                                              rejecting this booking. The client
                                              will be notified.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <div className="my-4">
                                            <Label htmlFor="rejection_reason">
                                              Rejection Reason
                                            </Label>
                                            <Textarea
                                              id="rejection_reason"
                                              value={rejectionReason}
                                              onChange={(e) =>
                                                setRejectionReason(
                                                  e.target.value,
                                                )
                                              }
                                              placeholder="Equipment unavailable, dates conflict, etc..."
                                              rows={3}
                                            />
                                          </div>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>
                                              Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() =>
                                                handleRejectBooking(
                                                  selectedBooking,
                                                )
                                              }
                                              className="bg-red-500 hover:bg-red-600"
                                            >
                                              Reject Booking
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </div>
                                )}

                                {selectedBooking.status === "approved" && (
                                  <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                      <CheckCircle className="w-5 h-5 text-green-500" />
                                      <span className="font-medium text-green-800">
                                        Booking Approved
                                      </span>
                                    </div>
                                    {selectedBooking.approval_date && (
                                      <p className="text-sm text-green-600 mt-1">
                                        Approved on{" "}
                                        {formatDate(
                                          selectedBooking.approval_date,
                                        )}
                                      </p>
                                    )}
                                  </div>
                                )}

                                {selectedBooking.status === "rejected" && (
                                  <div className="bg-red-50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                      <XCircle className="w-5 h-5 text-red-500" />
                                      <span className="font-medium text-red-800">
                                        Booking Rejected
                                      </span>
                                    </div>
                                    {selectedBooking.rejection_reason && (
                                      <p className="text-sm text-red-600 mt-1">
                                        Reason:{" "}
                                        {selectedBooking.rejection_reason}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {booking.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                handleApproveBooking(booking);
                              }}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}

                        {booking.status === "approved" && (
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-1" />
                            Generate Contract
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
