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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  DollarSign,
  Calendar,
  Truck,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  MapPin,
  Star,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useEnhancedDashboard } from "@/hooks/useEnhancedSupabase";
import type { FilterOptions } from "@/lib/enhanced-types";
import { cn } from "@/lib/utils";

export function EnhancedDashboard() {
  const [timeFilter, setTimeFilter] =
    useState<FilterOptions["timeRange"]>("month");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const { stats, loading } = useEnhancedDashboard({ timeRange: timeFilter });

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const getChangeIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getChangeColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600";
  };

  const revenueChartConfig = {
    revenue: {
      label: "Revenue",
      color: "#f97316",
    },
    bookings: {
      label: "Bookings",
      color: "#3b82f6",
    },
  };

  const equipmentTypeColors = {
    excavator: "#f97316",
    crane: "#3b82f6",
    bulldozer: "#10b981",
    loader: "#8b5cf6",
    forklift: "#f59e0b",
    compactor: "#ef4444",
    generator: "#06b6d4",
    scaffolding: "#84cc16",
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Time Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Business Dashboard</h2>
        <div className="flex items-center space-x-4">
          <Select
            value={timeFilter}
            onValueChange={(value: any) => setTimeFilter(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <div className="flex items-center mt-2">
                  {getChangeIcon(stats.monthlyGrowth)}
                  <span
                    className={cn(
                      "text-sm ml-1",
                      getChangeColor(stats.monthlyGrowth),
                    )}
                  >
                    {Math.abs(stats.monthlyGrowth)}% vs last period
                  </span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Bookings
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.activeBookings}
                </p>
                <div className="flex items-center mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    {stats.pendingBookings} pending
                  </Badge>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
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
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalEquipment}
                </p>
                <div className="flex items-center mt-2">
                  <Badge variant="default" className="bg-green-500">
                    {stats.availableEquipment} available
                  </Badge>
                </div>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Truck className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Clients
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.clientCount}
                </p>
                <div className="flex items-center mt-2">
                  <Activity className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    {stats.onlineClients} online now
                  </span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Daily Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.dailyRevenue)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(stats.monthlyRevenue)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Annual Revenue</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(stats.annualRevenue)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="equipment">Equipment Performance</TabsTrigger>
          <TabsTrigger value="clients">Client Analytics</TabsTrigger>
          <TabsTrigger value="utilization">Utilization Rates</TabsTrigger>
        </TabsList>

        {/* Revenue Trends */}
        <TabsContent value="revenue">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Period</CardTitle>
                <CardDescription>
                  Revenue and booking trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={revenueChartConfig}
                  className="h-[300px]"
                >
                  <AreaChart
                    data={stats.revenueByPeriod}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="period"
                      axisLine={true}
                      tickLine={true}
                      type="category"
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `$${(value / 1000).toFixed(0)}k`
                      }
                      axisLine={true}
                      tickLine={true}
                      type="number"
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      fill="var(--color-revenue)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Equipment by Revenue</CardTitle>
                <CardDescription>
                  Most profitable equipment this period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topEquipment.slice(0, 5).map((item, index) => (
                    <div
                      key={item.equipment.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-lg font-bold text-gray-400">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{item.equipment.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.bookings} bookings
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {formatCurrency(item.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Equipment Performance */}
        <TabsContent value="equipment">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Utilization</CardTitle>
                <CardDescription>Usage efficiency by equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.equipmentPerformance.slice(0, 8).map((item) => (
                    <div key={item.equipment.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {item.equipment.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {item.utilizationRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(item.utilizationRate, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Equipment Revenue Performance</CardTitle>
                <CardDescription>
                  Revenue generated by equipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px]">
                  <BarChart data={stats.equipmentPerformance.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="equipment.name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `$${(value / 1000).toFixed(0)}k`
                      }
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Revenue",
                      ]}
                    />
                    <Bar dataKey="revenueGenerated" fill="#f97316" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Client Analytics */}
        <TabsContent value="clients">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Clients by Revenue</CardTitle>
                <CardDescription>
                  Most valuable clients this period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topClients.map((item, index) => (
                    <div
                      key={item.client.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-lg font-bold text-gray-400">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{item.client.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.client.company || item.client.profession}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.bookingCount} bookings
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {formatCurrency(item.totalSpent)}
                        </p>
                        <div className="flex items-center mt-1">
                          <Star className="w-3 h-3 text-yellow-400 mr-1" />
                          <span className="text-xs text-gray-600">
                            {item.client.reliability_score}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Activity Status</CardTitle>
                <CardDescription>
                  Current client engagement levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {stats.onlineClients}
                      </div>
                      <div className="text-sm text-gray-600">Online Now</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {stats.clientCount - stats.onlineClients}
                      </div>
                      <div className="text-sm text-gray-600">Offline</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Online Rate</span>
                      <span className="text-sm font-medium">
                        {(
                          (stats.onlineClients / stats.clientCount) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${(stats.onlineClients / stats.clientCount) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Utilization Rates */}
        <TabsContent value="utilization">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Equipment Utilization</CardTitle>
                <CardDescription>Fleet efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600">
                      {stats.utilizationRate}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Overall Utilization Rate
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Available Equipment</span>
                      <Badge variant="default" className="bg-green-500">
                        {stats.availableEquipment}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Currently Rented</span>
                      <Badge variant="default" className="bg-orange-500">
                        {stats.totalEquipment - stats.availableEquipment}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Fleet Size</span>
                      <Badge variant="secondary">{stats.totalEquipment}</Badge>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-orange-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${stats.utilizationRate}%` }}
                    ></div>
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    Target: 80% | Industry Average: 65%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilization Alerts</CardTitle>
                <CardDescription>Equipment requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock alerts */}
                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        Low Utilization Alert
                      </p>
                      <p className="text-xs text-red-600">
                        3 excavators have been idle for 7+ days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Maintenance Due
                      </p>
                      <p className="text-xs text-yellow-600">
                        2 cranes require scheduled maintenance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        High Demand
                      </p>
                      <p className="text-xs text-green-600">
                        All bulldozers are fully booked this month
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Location Update
                      </p>
                      <p className="text-xs text-blue-600">
                        5 equipment locations need GPS updates
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
