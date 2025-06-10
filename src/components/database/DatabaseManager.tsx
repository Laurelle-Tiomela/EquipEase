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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Truck,
  Users,
  Calendar,
  MessageSquare,
  RefreshCw,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
} from "lucide-react";
import { useEnhancedSupabase, useMessages } from "@/hooks/useEnhancedSupabase";
import { cn } from "@/lib/utils";

export function DatabaseManager() {
  const [activeTab, setActiveTab] = useState("overview");
  const {
    equipment,
    clients,
    bookings,
    equipmentLoading,
    clientsLoading,
    bookingsLoading,
  } = useEnhancedSupabase();
  const { messages } = useMessages();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "active":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "rejected":
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-500";
      case "rented":
        return "bg-red-500";
      case "maintenance":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  // Calculate statistics
  const totalRevenue = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, booking) => {
      const equipmentItem = equipment.find(
        (e) => e.id === booking.equipment_id,
      );
      return sum + (equipmentItem?.daily_rate || 0) * booking.duration_days;
    }, 0);

  const activeBookings = bookings.filter((b) => b.status === "active").length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const completedBookings = bookings.filter(
    (b) => b.status === "completed",
  ).length;

  const availableEquipment = equipment.filter(
    (e) => e.availability === "available",
  ).length;
  const rentedEquipment = equipment.filter(
    (e) => e.availability === "rented",
  ).length;

  const onlineClients = clients.filter((c) => c.is_online).length;

  return (
    <div className="space-y-6">
      {/* Database Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Equipment</p>
                <p className="text-2xl font-bold">{equipment.length}</p>
                <p className="text-xs text-gray-500">
                  {availableEquipment} available • {rentedEquipment} rented
                </p>
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
                <p className="text-xs text-gray-500">{onlineClients} online</p>
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
                <p className="text-xs text-gray-500">
                  {activeBookings} active • {pendingBookings} pending
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalRevenue)}
                </p>
                <p className="text-xs text-gray-500">
                  {completedBookings} completed bookings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Tables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Live Database Data
          </CardTitle>
          <CardDescription>
            Real-time view of your equipment rental business data from the
            comprehensive sample database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Equipment Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Available:</span>
                        <Badge className="bg-green-500">
                          {availableEquipment}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Rented:</span>
                        <Badge className="bg-red-500">{rentedEquipment}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Maintenance:</span>
                        <Badge className="bg-yellow-500">
                          {
                            equipment.filter(
                              (e) => e.availability === "maintenance",
                            ).length
                          }
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Booking Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Active:</span>
                        <Badge className="bg-blue-500">{activeBookings}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending:</span>
                        <Badge className="bg-yellow-500">
                          {pendingBookings}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed:</span>
                        <Badge className="bg-green-500">
                          {completedBookings}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Utilization:</span>
                        <Badge>
                          {equipment.length > 0
                            ? Math.round(
                                (rentedEquipment / equipment.length) * 100,
                              )
                            : 0}
                          %
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Booking:</span>
                        <Badge>
                          {formatCurrency(
                            bookings.length > 0
                              ? totalRevenue / completedBookings || 0
                              : 0,
                          )}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Messages:</span>
                        <Badge className="bg-purple-500">
                          {messages.length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Equipment Tab */}
            <TabsContent value="equipment" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Equipment Database ({equipment.length} items)
                </h3>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {availableEquipment} Available
                  </Badge>
                  <Badge variant="outline">{rentedEquipment} Rented</Badge>
                </div>
              </div>

              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {equipment.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold">{item.name}</h4>
                              <p className="text-sm text-gray-600 capitalize">
                                {item.type}
                              </p>
                              <p className="text-xs text-gray-500">
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
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  Popularity:
                                </span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={`text-xs ${i < Math.floor(item.popularity_score / 20) ? "text-yellow-500" : "text-gray-300"}`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">
                                  ({item.popularity_score}/100)
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={cn(
                                "text-white",
                                getAvailabilityColor(item.availability),
                              )}
                            >
                              {item.availability}
                            </Badge>
                            {item.available_date && (
                              <p className="text-xs text-gray-500 mt-1">
                                Available: {formatDate(item.available_date)}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Clients Tab */}
            <TabsContent value="clients" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Client Database ({clients.length} clients)
                </h3>
                <div className="flex gap-2">
                  <Badge variant="outline">{onlineClients} Online</Badge>
                  <Badge variant="outline">
                    {clients.length - onlineClients} Offline
                  </Badge>
                </div>
              </div>

              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {clients.map((client) => (
                    <Card key={client.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            <img
                              src={client.avatar_url}
                              alt={client.name}
                              className="w-12 h-12 object-cover rounded-full"
                            />
                            <div>
                              <h4 className="font-semibold">{client.name}</h4>
                              <p className="text-sm text-gray-600">
                                {client.company}
                              </p>
                              <p className="text-sm text-gray-500">
                                {client.profession}
                              </p>
                              <p className="text-sm text-gray-500">
                                {client.email}
                              </p>
                              <p className="text-sm text-gray-500">
                                {client.phone}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  Reliability:
                                </span>
                                <div className="flex">
                                  {[...Array(10)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={`text-xs ${i < client.reliability_score ? "text-green-500" : "text-gray-300"}`}
                                    >
                                      ●
                                    </span>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">
                                  ({client.reliability_score}/10)
                                </span>
                              </div>
                            </div>
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
                              {client.total_bookings} bookings
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatCurrency(client.total_spent)} spent
                            </p>
                            <p className="text-xs text-gray-500">
                              Registered: {formatDate(client.registration_date)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Booking Database ({bookings.length} bookings)
                </h3>
                <div className="flex gap-2">
                  <Badge variant="outline">{activeBookings} Active</Badge>
                  <Badge variant="outline">{pendingBookings} Pending</Badge>
                  <Badge variant="outline">{completedBookings} Completed</Badge>
                </div>
              </div>

              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const equipmentItem = equipment.find(
                      (e) => e.id === booking.equipment_id,
                    );
                    const client = clients.find(
                      (c) => c.id === booking.client_id,
                    );
                    const revenue =
                      (equipmentItem?.daily_rate || 0) * booking.duration_days;

                    return (
                      <Card key={booking.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              {equipmentItem && (
                                <img
                                  src={equipmentItem.image_url}
                                  alt={equipmentItem.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                              )}
                              <div>
                                <h4 className="font-semibold">
                                  {equipmentItem?.name || "Unknown Equipment"}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Client: {client?.name || "Unknown Client"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Company: {client?.company}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Duration: {booking.duration_days} days
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatDate(booking.start_date)} -{" "}
                                  {formatDate(booking.end_date)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Destination: {booking.destination}
                                </p>
                                {booking.gratitude_message && (
                                  <p className="text-xs text-gray-400 italic mt-1">
                                    "{booking.gratitude_message}"
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 mb-2">
                                {getStatusIcon(booking.status)}
                                <Badge variant="outline">
                                  {booking.status}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium">
                                Revenue: {formatCurrency(revenue)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Payment: {booking.payment_method}
                              </p>
                              <p className="text-xs text-gray-500">
                                Status: {booking.payment_status}
                              </p>
                              <p className="text-xs text-gray-500">
                                Created: {formatDate(booking.created_at)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Message Database ({messages.length} messages)
                </h3>
                <Badge variant="outline">
                  {messages.filter((m) => !m.is_read).length} Unread
                </Badge>
              </div>

              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const client = clients.find(
                      (c) =>
                        c.id === message.sender_id ||
                        c.id === message.receiver_id,
                    );
                    const isFromAdmin = message.sender_id === "admin";

                    return (
                      <Card key={message.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4 flex-1">
                              {client && (
                                <img
                                  src={client.avatar_url}
                                  alt={client.name}
                                  className="w-10 h-10 object-cover rounded-full"
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge
                                    variant={
                                      isFromAdmin ? "default" : "secondary"
                                    }
                                  >
                                    {isFromAdmin ? "Admin" : "Client"}
                                  </Badge>
                                  <span className="text-sm font-medium">
                                    {isFromAdmin
                                      ? "You"
                                      : client?.name || "Unknown User"}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(
                                      message.timestamp,
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm">{message.content}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {message.type}
                                  </Badge>
                                  {message.is_pinned && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-yellow-50"
                                    >
                                      Pinned
                                    </Badge>
                                  )}
                                </div>
                              </div>
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
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
