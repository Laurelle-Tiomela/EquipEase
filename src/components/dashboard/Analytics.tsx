import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { mockDashboardStats } from "@/lib/mock-data";
import { useState } from "react";

const revenueData = [
  { month: "Jan", revenue: 45000, bookings: 12 },
  { month: "Feb", revenue: 52000, bookings: 15 },
  { month: "Mar", revenue: 48000, bookings: 13 },
  { month: "Apr", revenue: 61000, bookings: 18 },
  { month: "May", revenue: 55000, bookings: 16 },
  { month: "Jun", revenue: 67000, bookings: 20 },
];

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "#f97316",
  },
};

const equipmentUsage = [
  { name: "Excavators", value: 35, fill: "#f97316" },
  { name: "Cranes", value: 25, fill: "#3b82f6" },
  { name: "Bulldozers", value: 20, fill: "#10b981" },
  { name: "Loaders", value: 20, fill: "#8b5cf6" },
];

const equipmentChartConfig = {
  excavators: {
    label: "Excavators",
    color: "#f97316",
  },
  cranes: {
    label: "Cranes",
    color: "#3b82f6",
  },
  bulldozers: {
    label: "Bulldozers",
    color: "#10b981",
  },
  loaders: {
    label: "Loaders",
    color: "#8b5cf6",
  },
};

export function Analytics() {
  const [timeFilter, setTimeFilter] = useState("month");
  const [equipmentFilter, setEquipmentFilter] = useState("all");

  const stats = [
    {
      title: "Total Revenue",
      value: `$${mockDashboardStats.totalRevenue.toLocaleString()}`,
      change: `+${mockDashboardStats.monthlyGrowth}%`,
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Active Bookings",
      value: mockDashboardStats.activeBookings.toString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Calendar,
    },
    {
      title: "Equipment Fleet",
      value: mockDashboardStats.totalEquipment.toString(),
      change: "+2",
      changeType: "positive" as const,
      icon: Truck,
    },
    {
      title: "Total Clients",
      value: mockDashboardStats.clientCount.toString(),
      change: "+8%",
      changeType: "positive" as const,
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Analytics Filters</span>
              </CardTitle>
              <CardDescription>Filter your dashboard data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Time Range:</label>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Equipment:</label>
              <Select
                value={equipmentFilter}
                onValueChange={setEquipmentFilter}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="excavator">Excavators</SelectItem>
                  <SelectItem value="crane">Cranes</SelectItem>
                  <SelectItem value="bulldozer">Bulldozers</SelectItem>
                  <SelectItem value="loader">Loaders</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm">
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Icon className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <Badge
                    variant={
                      stat.changeType === "positive" ? "default" : "destructive"
                    }
                    className={
                      stat.changeType === "positive"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </Badge>
                  <span className="text-sm text-gray-500 ml-2">
                    vs last period
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Bookings Trend</CardTitle>
            <CardDescription>Monthly performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="h-[300px]">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={[4, 4, 0, 0]}
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
              <PieChart>
                <Pie
                  data={equipmentUsage}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
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

      {/* Utilization Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Utilization Rate</CardTitle>
          <CardDescription>
            How efficiently your equipment is being used
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Utilization</span>
              <span className="text-2xl font-bold text-orange-600">
                {mockDashboardStats.utilizationRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${mockDashboardStats.utilizationRate}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              Your equipment is being utilized efficiently. Aim for 80%+ for
              optimal profitability.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
