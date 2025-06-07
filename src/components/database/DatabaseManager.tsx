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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Truck,
  Users,
  Calendar,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import {
  useEquipment,
  useClients,
  useBookings,
  useMessages,
} from "@/hooks/useSupabase";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function DatabaseManager() {
  const [activeTab, setActiveTab] = useState("equipment");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const {
    equipment,
    loading: equipmentLoading,
    addEquipment,
    updateEquipment,
  } = useEquipment();
  const { clients, loading: clientsLoading } = useClients();
  const {
    bookings,
    loading: bookingsLoading,
    updateBookingStatus,
  } = useBookings();
  const { messages, loading: messagesLoading } = useMessages();

  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: "excavator" as const,
    description: "",
    daily_rate: 0,
    weekly_rate: 0,
    monthly_rate: 0,
    availability: "available" as const,
    image_url: "/placeholder.svg",
    specifications: {
      weight: "",
      power: "",
      capacity: "",
      dimensions: "",
    },
  });

  const handleAddEquipment = async () => {
    try {
      await addEquipment(newEquipment);
      toast.success("Equipment added successfully");
      setShowAddForm(false);
      setNewEquipment({
        name: "",
        type: "excavator",
        description: "",
        daily_rate: 0,
        weekly_rate: 0,
        monthly_rate: 0,
        availability: "available",
        image_url: "/placeholder.svg",
        specifications: {
          weight: "",
          power: "",
          capacity: "",
          dimensions: "",
        },
      });
    } catch (error) {
      toast.error("Failed to add equipment");
    }
  };

  const handleUpdateEquipmentAvailability = async (
    id: string,
    availability: string,
  ) => {
    try {
      await updateEquipment(id, { availability: availability as any });
      toast.success("Equipment updated successfully");
    } catch (error) {
      toast.error("Failed to update equipment");
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      await updateBookingStatus(id, status as any);
      toast.success("Booking status updated");
    } catch (error) {
      toast.error("Failed to update booking");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Database Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Equipment</p>
                <p className="text-2xl font-bold">{equipment.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Clients</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Bookings</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Messages</p>
                <p className="text-2xl font-bold">{messages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Tables */}
      <Card>
        <CardHeader>
          <CardTitle>Database Management</CardTitle>
          <CardDescription>
            View and manage your equipment, clients, bookings, and messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            {/* Equipment Tab */}
            <TabsContent value="equipment" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Equipment Management</h3>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Equipment
                </Button>
              </div>

              {showAddForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Equipment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Equipment Name</Label>
                        <Input
                          id="name"
                          value={newEquipment.name}
                          onChange={(e) =>
                            setNewEquipment({
                              ...newEquipment,
                              name: e.target.value,
                            })
                          }
                          placeholder="e.g., CAT 320 Excavator"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={newEquipment.type}
                          onValueChange={(value) =>
                            setNewEquipment({
                              ...newEquipment,
                              type: value as any,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excavator">Excavator</SelectItem>
                            <SelectItem value="crane">Crane</SelectItem>
                            <SelectItem value="bulldozer">Bulldozer</SelectItem>
                            <SelectItem value="loader">Loader</SelectItem>
                            <SelectItem value="forklift">Forklift</SelectItem>
                            <SelectItem value="compactor">Compactor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newEquipment.description}
                        onChange={(e) =>
                          setNewEquipment({
                            ...newEquipment,
                            description: e.target.value,
                          })
                        }
                        placeholder="Equipment description..."
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="daily_rate">Daily Rate ($)</Label>
                        <Input
                          id="daily_rate"
                          type="number"
                          value={newEquipment.daily_rate}
                          onChange={(e) =>
                            setNewEquipment({
                              ...newEquipment,
                              daily_rate: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="weekly_rate">Weekly Rate ($)</Label>
                        <Input
                          id="weekly_rate"
                          type="number"
                          value={newEquipment.weekly_rate}
                          onChange={(e) =>
                            setNewEquipment({
                              ...newEquipment,
                              weekly_rate: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="monthly_rate">Monthly Rate ($)</Label>
                        <Input
                          id="monthly_rate"
                          type="number"
                          value={newEquipment.monthly_rate}
                          onChange={(e) =>
                            setNewEquipment({
                              ...newEquipment,
                              monthly_rate: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          value={newEquipment.specifications.weight}
                          onChange={(e) =>
                            setNewEquipment({
                              ...newEquipment,
                              specifications: {
                                ...newEquipment.specifications,
                                weight: e.target.value,
                              },
                            })
                          }
                          placeholder="e.g., 20,000 kg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="power">Power</Label>
                        <Input
                          id="power"
                          value={newEquipment.specifications.power}
                          onChange={(e) =>
                            setNewEquipment({
                              ...newEquipment,
                              specifications: {
                                ...newEquipment.specifications,
                                power: e.target.value,
                              },
                            })
                          }
                          placeholder="e.g., 121 kW"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button onClick={handleAddEquipment} className="flex-1">
                        Add Equipment
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {equipmentLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : equipment.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No equipment found
                    </p>
                  ) : (
                    equipment.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold">{item.name}</h4>
                              <p className="text-sm text-gray-600">
                                {item.description}
                              </p>
                              <div className="flex space-x-4 mt-2 text-sm">
                                <span>
                                  Daily: {formatCurrency(item.daily_rate)}
                                </span>
                                <span>
                                  Weekly: {formatCurrency(item.weekly_rate)}
                                </span>
                                <span>
                                  Monthly: {formatCurrency(item.monthly_rate)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Select
                                value={item.availability}
                                onValueChange={(value) =>
                                  handleUpdateEquipmentAvailability(
                                    item.id,
                                    value,
                                  )
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="available">
                                    Available
                                  </SelectItem>
                                  <SelectItem value="rented">Rented</SelectItem>
                                  <SelectItem value="maintenance">
                                    Maintenance
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Badge
                                variant={
                                  item.availability === "available"
                                    ? "default"
                                    : "secondary"
                                }
                                className={cn(
                                  item.availability === "available" &&
                                    "bg-green-500",
                                  item.availability === "rented" &&
                                    "bg-red-500",
                                  item.availability === "maintenance" &&
                                    "bg-yellow-500",
                                )}
                              >
                                {item.availability}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Clients Tab */}
            <TabsContent value="clients" className="space-y-4">
              <h3 className="text-lg font-semibold">Client Management</h3>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {clientsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : clients.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No clients found
                    </p>
                  ) : (
                    clients.map((client) => (
                      <Card key={client.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{client.name}</h4>
                              <p className="text-sm text-gray-600">
                                {client.company}
                              </p>
                              <p className="text-sm text-gray-500">
                                {client.email}
                              </p>
                              <p className="text-sm text-gray-500">
                                {client.phone}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  client.is_online ? "default" : "secondary"
                                }
                              >
                                {client.is_online ? "Online" : "Offline"}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                Registered:{" "}
                                {formatDate(client.registration_date)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-4">
              <h3 className="text-lg font-semibold">Booking Management</h3>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {bookingsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : bookings.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No bookings found
                    </p>
                  ) : (
                    bookings.map((booking) => {
                      const equipmentItem = equipment.find(
                        (e) => e.id === booking.equipment_id,
                      );
                      const client = clients.find(
                        (c) => c.id === booking.client_id,
                      );

                      return (
                        <Card key={booking.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">
                                  {equipmentItem?.name || "Unknown Equipment"}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Client: {client?.name || "Unknown Client"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatDate(booking.start_date)} -{" "}
                                  {formatDate(booking.end_date)}
                                </p>
                                <p className="text-sm font-medium">
                                  Total: {formatCurrency(booking.total_amount)}
                                </p>
                                {booking.notes && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Notes: {booking.notes}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Select
                                  value={booking.status}
                                  onValueChange={(value) =>
                                    handleUpdateBookingStatus(booking.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">
                                      Pending
                                    </SelectItem>
                                    <SelectItem value="confirmed">
                                      Confirmed
                                    </SelectItem>
                                    <SelectItem value="active">
                                      Active
                                    </SelectItem>
                                    <SelectItem value="completed">
                                      Completed
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                      Cancelled
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <Badge
                                  variant={
                                    booking.status === "completed"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className={cn(
                                    booking.status === "pending" &&
                                      "bg-yellow-500",
                                    booking.status === "confirmed" &&
                                      "bg-blue-500",
                                    booking.status === "active" &&
                                      "bg-green-500",
                                    booking.status === "completed" &&
                                      "bg-gray-500",
                                    booking.status === "cancelled" &&
                                      "bg-red-500",
                                  )}
                                >
                                  {booking.status}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              <h3 className="text-lg font-semibold">Message History</h3>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No messages found
                    </p>
                  ) : (
                    messages.map((message) => {
                      const client = clients.find(
                        (c) =>
                          c.id === message.sender_id ||
                          c.id === message.receiver_id,
                      );

                      return (
                        <Card key={message.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Badge
                                    variant={
                                      message.sender_id === "manager"
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {message.sender_id === "manager"
                                      ? "Manager"
                                      : "Client"}
                                  </Badge>
                                  <span className="text-sm text-gray-500">
                                    {client?.name || "Unknown User"}
                                  </span>
                                </div>
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(message.timestamp).toLocaleString()}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  message.is_read ? "default" : "destructive"
                                }
                              >
                                {message.is_read ? "Read" : "Unread"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
