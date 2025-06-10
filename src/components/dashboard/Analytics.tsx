import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  Calendar,
  Truck,
  Users,
  TrendingUp,
  Filter,
} from "lucide-react";
import { useEnhancedSupabase } from "@/hooks/useEnhancedSupabase";
import { useLanguage } from "@/contexts/LanguageContext";

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
};

const equipmentChartConfig = {
  excavator: { label: "Excavator", color: "#8884d8" },
  crane: { label: "Crane", color: "#82ca9d" },
  loader: { label: "Loader", color: "#ffc658" },
  forklift: { label: "Forklift", color: "#ff7300" },
  compactor: { label: "Compactor", color: "#00ff7f" },
  generator: { label: "Generator", color: "#dc143c" },
};

export function Analytics() {
  const [dateRange, setDateRange] = useState("month");
  const { equipment, clients, bookings, stats } = useEnhancedSupabase();
  const { t } = useLanguage();

  // Calculate real revenue from sample data
  const revenueData = useMemo(() => {
    const monthlyRevenue = new Map();

    bookings.forEach((booking) => {
      if (booking.status === "completed") {
        const date = new Date(booking.created_at);
        const monthKey = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        const equipmentItem = equipment.find(
          (e) => e.id === booking.equipment_id,
        );
        const revenue =
          (equipmentItem?.daily_rate || 0) * booking.duration_days;

        monthlyRevenue.set(
          monthKey,
          (monthlyRevenue.get(monthKey) || 0) + revenue,
        );
      }
    });

    // Get last 6 months
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      months.push({
        month: monthKey,
        revenue: monthlyRevenue.get(monthKey) || 0,
      });
    }

    return months;
  }, [bookings, equipment]);

  // Calculate equipment usage
  const equipmentUsage = useMemo(() => {
    const usage = new Map();

    bookings.forEach((booking) => {
      const equipmentItem = equipment.find(
        (e) => e.id === booking.equipment_id,
      );
      if (equipmentItem) {
        const type = equipmentItem.type;
        usage.set(type, (usage.get(type) || 0) + 1);
      }
    });

    const total = Array.from(usage.values()).reduce(
      (sum, count) => sum + count,
      0,
    );

    return Array.from(usage.entries()).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: total > 0 ? Math.round((count / total) * 100) : 0,
      fill:
        equipmentChartConfig[type as keyof typeof equipmentChartConfig]
          ?.color || "#8884d8",
    }));
  }, [bookings, equipment]);

  // Calculate key metrics
  const totalRevenue = useMemo(() => {
    return bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, booking) => {
        const equipmentItem = equipment.find(
          (e) => e.id === booking.equipment_id,
        );
        return sum + (equipmentItem?.daily_rate || 0) * booking.duration_days;
      }, 0);
  }, [bookings, equipment]);

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => b.status === "active").length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const completedBookings = bookings.filter(
    (b) => b.status === "completed",
  ).length;

  const utilizationRate =
    equipment.length > 0
      ? Math.round(
          (equipment.filter((e) => e.availability === "rented").length /
            equipment.length) *
            100,
        )
      : 0;

  const avgBookingValue =
    completedBookings > 0 ? totalRevenue / completedBookings : 0;

  // Calculate monthly growth
  const currentMonthRevenue = revenueData[revenueData.length - 1]?.revenue || 0;
  const lastMonthRevenue = revenueData[revenueData.length - 2]?.revenue || 0;
  const monthlyGrowth =
    lastMonthRevenue > 0
      ? Math.round(
          ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100,
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">
            {t("dashboard.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 3 months</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold">
                  ${totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {completedBookings} completed bookings
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">
                {monthlyGrowth >= 0 ? "+" : ""}
                {monthlyGrowth}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-2xl font-bold">{totalBookings}</p>
                <p className="text-xs text-gray-500">
                  {activeBookings} active • {pendingBookings} pending
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex space-x-2">
                <Badge variant="outline" className="text-xs">
                  {Math.round((completedBookings / totalBookings) * 100)}%
                  completion rate
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Equipment Fleet
                </p>
                <p className="text-2xl font-bold">{equipment.length}</p>
                <p className="text-xs text-gray-500">
                  {
                    equipment.filter((e) => e.availability === "available")
                      .length
                  }{" "}
                  available
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Truck className="h-4 w-4 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${utilizationRate}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium ml-2">
                  {utilizationRate}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Utilization rate</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Clients
                </p>
                <p className="text-2xl font-bold">{clients.length}</p>
                <p className="text-xs text-gray-500">
                  {clients.filter((c) => c.is_online).length} online now
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex space-x-2">
                <Badge variant="outline" className="text-xs">
                  Avg: ${Math.round(avgBookingValue)} per booking
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>
              Monthly revenue over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="h-[300px]">
              <BarChart
                data={revenueData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  axisLine={true}
                  tickLine={true}
                  type="category"
                />
                <YAxis
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  axisLine={true}
                  tickLine={true}
                  type="number"
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                  cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={[4, 4, 0, 0]}
                  stroke="none"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Equipment Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment Usage</CardTitle>
            <CardDescription>Distribution by equipment type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={equipmentChartConfig} className="h-[300px]">
              <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Pie
                  data={equipmentUsage}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={0}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {equipmentUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`${value}%`, "Usage"]}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Booking Activity</CardTitle>
          <CardDescription>
            Latest equipment bookings and status updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking) => {
              const equipmentItem = equipment.find(
                (e) => e.id === booking.equipment_id,
              );
              const client = clients.find((c) => c.id === booking.client_id);
              const revenue =
                (equipmentItem?.daily_rate || 0) * booking.duration_days;

              return (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={equipmentItem?.image_url || "/placeholder.svg"}
                      alt={equipmentItem?.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium">{equipmentItem?.name}</p>
                      <p className="text-sm text-gray-600">
                        {client?.name} • {client?.company}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.start_date).toLocaleDateString()} -{" "}
                        {booking.duration_days} days
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        booking.status === "completed" ? "default" : "secondary"
                      }
                      className={
                        booking.status === "active"
                          ? "bg-blue-500"
                          : booking.status === "pending"
                            ? "bg-yellow-500"
                            : booking.status === "completed"
                              ? "bg-green-500"
                              : "bg-gray-500"
                      }
                    >
                      {booking.status}
                    </Badge>
                    <p className="text-sm font-medium mt-1">
                      ${revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
