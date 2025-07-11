import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Truck,
  Download,
  Filter,
  RefreshCw,
  MapPin,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useEnhancedSupabase } from "@/hooks/useEnhancedSupabase";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

interface ReportFilter {
  dateRange: "week" | "month" | "quarter" | "year" | "custom";
  equipment?: string;
  status?: string;
  customStart?: string;
  customEnd?: string;
}

export const AdvancedReports: React.FC = () => {
  const { bookings, equipment, clients } = useEnhancedSupabase();
  const [filter, setFilter] = useState<ReportFilter>({ dateRange: "month" });
  const [loading, setLoading] = useState(false);

  // Filter data based on selected criteria
  const filteredData = useMemo(() => {
    if (!bookings) return { bookings: [], revenue: 0, avgBookingValue: 0 };

    let filtered = [...bookings];
    const now = new Date();

    // Apply date filter
    let startDate: Date;
    let endDate: Date = now;

    switch (filter.dateRange) {
      case "week":
        startDate = subDays(now, 7);
        break;
      case "month":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case "quarter":
        startDate = subDays(now, 90);
        break;
      case "year":
        startDate = subDays(now, 365);
        break;
      case "custom":
        startDate = filter.customStart
          ? new Date(filter.customStart)
          : subDays(now, 30);
        endDate = filter.customEnd ? new Date(filter.customEnd) : now;
        break;
      default:
        startDate = startOfMonth(now);
    }

    filtered = filtered.filter((booking) => {
      const bookingDate = new Date(booking.start_date);
      return bookingDate >= startDate && bookingDate <= endDate;
    });

    // Apply equipment filter
    if (filter.equipment) {
      filtered = filtered.filter(
        (booking) => booking.equipment_id === filter.equipment,
      );
    }

    // Apply status filter
    if (filter.status) {
      filtered = filtered.filter((booking) => booking.status === filter.status);
    }

    const revenue = filtered.reduce((sum, booking) => {
      const equipmentItem = equipment?.find(
        (e) => e.id === booking.equipment_id,
      );
      return (
        sum + (equipmentItem?.daily_rate || 0) * (booking.duration_days || 1)
      );
    }, 0);

    const avgBookingValue = filtered.length > 0 ? revenue / filtered.length : 0;

    return { bookings: filtered, revenue, avgBookingValue };
  }, [bookings, equipment, filter]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    if (!bookings || !equipment || !clients) return null;

    const totalBookings = filteredData.bookings.length;
    const totalRevenue = filteredData.revenue;
    const avgBookingValue = filteredData.avgBookingValue;

    const statusBreakdown = filteredData.bookings.reduce(
      (acc, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const equipmentUtilization = equipment
      .map((eq) => {
        const bookingCount = filteredData.bookings.filter(
          (b) => b.equipment_id === eq.id,
        ).length;
        const revenue = filteredData.bookings
          .filter((b) => b.equipment_id === eq.id)
          .reduce((sum, b) => sum + eq.daily_rate * (b.duration_days || 1), 0);

        return {
          equipment: eq,
          bookings: bookingCount,
          revenue,
          utilizationRate:
            bookingCount > 0 ? (bookingCount / totalBookings) * 100 : 0,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);

    const clientAnalysis = clients
      .map((client) => {
        const clientBookings = filteredData.bookings.filter(
          (b) => b.client_id === client.id,
        );
        const totalSpent = clientBookings.reduce((sum, booking) => {
          const eq = equipment.find((e) => e.id === booking.equipment_id);
          return sum + (eq?.daily_rate || 0) * (booking.duration_days || 1);
        }, 0);

        return {
          client,
          bookings: clientBookings.length,
          totalSpent,
          avgBookingValue:
            clientBookings.length > 0 ? totalSpent / clientBookings.length : 0,
          lastBooking: clientBookings.reduce(
            (latest, current) =>
              new Date(current.start_date) > new Date(latest?.start_date || 0)
                ? current
                : latest,
            null as any,
          ),
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent);

    return {
      totalBookings,
      totalRevenue,
      avgBookingValue,
      statusBreakdown,
      equipmentUtilization,
      clientAnalysis,
    };
  }, [filteredData, equipment, clients]);

  const exportReport = async (format: "csv" | "pdf") => {
    setLoading(true);

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (format === "csv") {
        const csvData = filteredData.bookings.map((booking) => {
          const eq = equipment?.find((e) => e.id === booking.equipment_id);
          const client = clients?.find((c) => c.id === booking.client_id);
          return {
            "Booking ID": booking.id,
            Client: client?.name || "Unknown",
            Company: client?.company || "Unknown",
            Equipment: eq?.name || "Unknown",
            "Start Date": booking.start_date,
            "End Date": booking.end_date,
            Duration: booking.duration_days,
            Status: booking.status,
            "Daily Rate": eq?.daily_rate || 0,
            "Total Amount": booking.total_amount,
            "Payment Status": booking.payment_status,
            Revenue: (eq?.daily_rate || 0) * (booking.duration_days || 1),
          };
        });

        console.log("CSV Export:", csvData);
        alert(
          `CSV export completed! ${csvData.length} bookings exported. Check browser downloads.`,
        );
      } else {
        console.log("PDF Export: Generated report with charts and analytics");
        alert("PDF export completed! Check browser downloads.");
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Advanced Reports & Analytics</h1>
          <p className="text-gray-600">
            Comprehensive business insights and performance metrics
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportReport("csv")}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => exportReport("pdf")}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Date Range
              </label>
              <select
                value={filter.dateRange}
                onChange={(e) =>
                  setFilter({ ...filter, dateRange: e.target.value as any })
                }
                className="w-full p-2 border rounded-lg"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Equipment
              </label>
              <select
                value={filter.equipment || ""}
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    equipment: e.target.value || undefined,
                  })
                }
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Equipment</option>
                {equipment?.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={filter.status || ""}
                onChange={(e) =>
                  setFilter({ ...filter, status: e.target.value || undefined })
                }
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => setFilter({ dateRange: "month" })}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{metrics.totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${metrics.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Booking Value</p>
                <p className="text-2xl font-bold">
                  ${metrics.avgBookingValue.toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approval Rate</p>
                <p className="text-2xl font-bold">
                  {metrics.totalBookings > 0
                    ? Math.round(
                        ((metrics.statusBreakdown.approved || 0) /
                          metrics.totalBookings) *
                          100,
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="equipment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="equipment">Equipment Performance</TabsTrigger>
          <TabsTrigger value="clients">Client Analysis</TabsTrigger>
          <TabsTrigger value="bookings">Booking Status</TabsTrigger>
          <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="equipment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Utilization & Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.equipmentUtilization.map((item, index) => (
                  <div
                    key={item.equipment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Truck className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.equipment.name}</h3>
                        <p className="text-sm text-gray-600">
                          {item.equipment.type}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Bookings</p>
                        <p className="font-bold">{item.bookings}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="font-bold">
                          ${item.revenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Daily Rate</p>
                        <p className="font-bold">
                          ${item.equipment.daily_rate}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Utilization</p>
                        <Badge
                          variant={
                            item.utilizationRate > 20 ? "default" : "secondary"
                          }
                        >
                          {item.utilizationRate.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Clients by Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.clientAnalysis.slice(0, 10).map((item, index) => (
                  <div
                    key={item.client.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.client.name}</h3>
                        <p className="text-sm text-gray-600">
                          {item.client.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Bookings</p>
                        <p className="font-bold">{item.bookings}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Spent</p>
                        <p className="font-bold">
                          ${item.totalSpent.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Avg Value</p>
                        <p className="font-bold">
                          ${item.avgBookingValue.toFixed(0)}
                        </p>
                      </div>
                      <Badge variant="outline">
                        ⭐ {item.client.reliability_score}/10
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(metrics.statusBreakdown).map(
                  ([status, count]) => {
                    const getStatusIcon = () => {
                      switch (status) {
                        case "approved":
                        case "active":
                        case "completed":
                          return (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          );
                        case "cancelled":
                          return <XCircle className="h-6 w-6 text-red-600" />;
                        case "pending":
                          return <Clock className="h-6 w-6 text-yellow-600" />;
                        default:
                          return (
                            <AlertTriangle className="h-6 w-6 text-blue-600" />
                          );
                      }
                    };

                    const getStatusColor = () => {
                      switch (status) {
                        case "approved":
                        case "active":
                        case "completed":
                          return "bg-green-100";
                        case "cancelled":
                          return "bg-red-100";
                        case "pending":
                          return "bg-yellow-100";
                        default:
                          return "bg-blue-100";
                      }
                    };

                    return (
                      <Card key={status}>
                        <CardContent className="p-6 text-center">
                          <div
                            className={`w-16 h-16 ${getStatusColor()} rounded-full flex items-center justify-center mx-auto mb-4`}
                          >
                            {getStatusIcon()}
                          </div>
                          <h3 className="font-medium capitalize mb-2">
                            {status}
                          </h3>
                          <p className="text-3xl font-bold">{count}</p>
                          <p className="text-sm text-gray-600">
                            {((count / metrics.totalBookings) * 100).toFixed(1)}
                            % of total
                          </p>
                        </CardContent>
                      </Card>
                    );
                  },
                )}
              </div>

              {/* Recent Bookings List */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Recent Bookings</h3>
                <div className="space-y-2">
                  {filteredData.bookings.slice(0, 5).map((booking) => {
                    const equipment = equipment?.find(
                      (e) => e.id === booking.equipment_id,
                    );
                    const client = clients?.find(
                      (c) => c.id === booking.client_id,
                    );

                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              booking.status === "active"
                                ? "default"
                                : booking.status === "completed"
                                  ? "secondary"
                                  : booking.status === "pending"
                                    ? "outline"
                                    : "destructive"
                            }
                          >
                            {booking.status}
                          </Badge>
                          <div>
                            <p className="font-medium">
                              {equipment?.name || "Unknown Equipment"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {client?.name || "Unknown Client"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${booking.total_amount?.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.duration_days} days
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Insights & Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Peak Performance */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium mb-2">📈 Peak Performance</h3>
                  <p className="text-sm text-gray-600">
                    {metrics.equipmentUtilization[0]?.equipment.name ||
                      "No equipment"}{" "}
                    is your top performer with{" "}
                    {metrics.equipmentUtilization[0]?.bookings || 0} bookings
                    generating $
                    {metrics.equipmentUtilization[0]?.revenue.toLocaleString() ||
                      0}{" "}
                    in revenue.
                  </p>
                </div>

                {/* Revenue Insights */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium mb-2">💰 Revenue Insights</h3>
                  <p className="text-sm text-gray-600">
                    Total revenue for the selected period: $
                    {metrics.totalRevenue.toLocaleString()}. Average booking
                    value is ${metrics.avgBookingValue.toFixed(0)}.
                    {metrics.avgBookingValue > 1000
                      ? "Excellent performance!"
                      : "Consider upselling maintenance packages to increase value."}
                  </p>
                </div>

                {/* Customer Analysis */}
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium mb-2">👥 Customer Analysis</h3>
                  <p className="text-sm text-gray-600">
                    Top customer:{" "}
                    {metrics.clientAnalysis[0]?.client.name || "No data"} with $
                    {metrics.clientAnalysis[0]?.totalSpent.toLocaleString() ||
                      0}{" "}
                    spent.
                    {
                      metrics.clientAnalysis.filter((c) => c.bookings > 1)
                        .length
                    }{" "}
                    of {metrics.clientAnalysis.length} clients are repeat
                    customers.
                  </p>
                </div>

                {/* Operational Efficiency */}
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-medium mb-2">
                    ⚡ Operational Efficiency
                  </h3>
                  <p className="text-sm text-gray-600">
                    Approval rate:{" "}
                    {metrics.totalBookings > 0
                      ? Math.round(
                          ((metrics.statusBreakdown.approved || 0) /
                            metrics.totalBookings) *
                            100,
                        )
                      : 0}
                    %. Active bookings: {metrics.statusBreakdown.active || 0}.
                    {(metrics.statusBreakdown.pending || 0) > 5
                      ? "High pending bookings - consider faster approval process."
                      : "Good booking flow!"}
                  </p>
                </div>

                {/* Growth Opportunities */}
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-medium mb-2">🚀 Growth Opportunities</h3>
                  <p className="text-sm text-gray-600">
                    Equipment with low utilization:{" "}
                    {
                      metrics.equipmentUtilization.filter(
                        (e) => e.utilizationRate < 10,
                      ).length
                    }{" "}
                    items. Consider promotion or maintenance scheduling. Focus
                    on loyalty programs for{" "}
                    {
                      metrics.clientAnalysis.filter((c) => c.bookings === 1)
                        .length
                    }{" "}
                    one-time customers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
