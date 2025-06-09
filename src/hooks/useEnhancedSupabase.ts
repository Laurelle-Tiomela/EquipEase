import { useState, useEffect } from "react";
import { supabase } from "@/lib/enhanced-supabase";
import {
  equipment as sampleEquipment,
  clients as sampleClients,
  bookings as sampleBookings,
  messages as sampleMessages,
  businessSettings as sampleBusinessSettings,
} from "@/lib/enhanced-sample-data";
import type {
  Equipment,
  Client,
  Booking,
  Message,
  BusinessSettings,
  DashboardStats,
  FilterOptions,
  ClientBookingForm,
  EquipmentAvailability,
  MaintenanceRecord,
  AnalyticsData,
} from "@/lib/enhanced-types";

// Equipment hooks with enhanced features
export function useEnhancedEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      // For demo purposes, use sample data instead of database
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
      setEquipment(sampleEquipment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const updateEquipmentLocation = async (
    id: string,
    location: { lat: number; lng: number; address: string },
  ) => {
    try {
      const { data, error } = await supabase
        .from("equipment")
        .update({ location, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setEquipment((prev) =>
        prev.map((item) => (item.id === id ? data : item)),
      );
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update location",
      );
      throw err;
    }
  };

  const getEquipmentAvailability = async (
    equipmentId: string,
    date: string,
  ): Promise<EquipmentAvailability> => {
    try {
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*, clients(name)")
        .eq("equipment_id", equipmentId)
        .eq("status", "active")
        .lte("start_date", date)
        .gte("end_date", date);

      if (error) throw error;

      const isAvailable = !bookings || bookings.length === 0;
      let availableDate: string | undefined;
      let currentBooking: any;

      if (!isAvailable && bookings.length > 0) {
        const latestBooking = bookings[0];
        availableDate = latestBooking.end_date;
        currentBooking = {
          client_name: latestBooking.clients?.name || "Unknown",
          end_date: latestBooking.end_date,
        };
      }

      return {
        equipment_id: equipmentId,
        available: isAvailable,
        available_date: availableDate,
        current_booking: currentBooking,
      };
    } catch (err) {
      throw new Error("Failed to check availability");
    }
  };

  return {
    equipment,
    loading,
    error,
    fetchEquipment,
    updateEquipmentLocation,
    getEquipmentAvailability,
  };
}

// Enhanced clients with filtering and reliability tracking
export function useEnhancedClients(filters?: FilterOptions) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, [filters]);

  const fetchClients = async () => {
    try {
      // For demo purposes, use sample data instead of database
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API delay

      let filteredClients = [...sampleClients];

      // Apply filters to sample data
      if (filters?.reliabilityScore) {
        filteredClients = filteredClients.filter(
          (client) =>
            client.reliability_score >= filters.reliabilityScore!.min &&
            client.reliability_score <= filters.reliabilityScore!.max,
        );
      }

      if (filters?.timeRange && filters.timeRange !== "custom") {
        const now = new Date();
        let startDate: Date;

        switch (filters.timeRange) {
          case "today":
            startDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
            );
            break;
          case "week":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case "year":
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = new Date(0);
        }

        filteredClients = filteredClients.filter(
          (client) => new Date(client.created_at) >= startDate,
        );
      }

      // Sort by reliability score
      filteredClients.sort((a, b) => b.reliability_score - a.reliability_score);

      setClients(filteredClients);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const updateClientReliability = async (id: string, score: number) => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .update({
          reliability_score: score,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setClients((prev) =>
        prev.map((client) => (client.id === id ? data : client)),
      );
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update reliability",
      );
      throw err;
    }
  };

  return { clients, loading, error, fetchClients, updateClientReliability };
}

// Enhanced bookings with approval system
export function useEnhancedBookings(filters?: FilterOptions) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    try {
      // For demo purposes, use sample data instead of database
      await new Promise((resolve) => setTimeout(resolve, 400)); // Simulate API delay

      let filteredBookings = [...sampleBookings];

      // Apply filters to sample data
      if (filters?.status) {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.status === filters.status,
        );
      }

      if (filters?.paymentStatus) {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.payment_status === filters.paymentStatus,
        );
      }

      if (filters?.equipmentType) {
        filteredBookings = filteredBookings.filter((booking) => {
          const equipment = sampleEquipment.find(
            (eq) => eq.id === booking.equipment_id,
          );
          return equipment?.type === filters.equipmentType;
        });
      }

      if (filters?.timeRange && filters.timeRange !== "custom") {
        const now = new Date();
        let startDate: Date;

        switch (filters.timeRange) {
          case "today":
            startDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
            );
            break;
          case "week":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case "year":
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = new Date(0);
        }

        filteredBookings = filteredBookings.filter(
          (booking) => new Date(booking.created_at) >= startDate,
        );
      }

      if (filters?.startDate && filters?.endDate) {
        filteredBookings = filteredBookings.filter(
          (booking) =>
            booking.start_date >= filters.startDate! &&
            booking.end_date <= filters.endDate!,
        );
      }

      // Sort by creation date
      filteredBookings.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      setBookings(filteredBookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const submitClientBooking = async (booking: ClientBookingForm) => {
    try {
      // First create or update client
      const { data: client, error: clientError } = await supabase
        .from("clients")
        .upsert(
          {
            name: booking.client_name,
            email: booking.email,
            phone: booking.phone,
            profession: booking.profession,
            address: "", // Will be updated later
            updated_at: new Date().toISOString(),
          },
          { onConflict: "email" },
        )
        .select()
        .single();

      if (clientError) throw clientError;

      // Calculate total amount
      const { data: equipment } = await supabase
        .from("equipment")
        .select("daily_rate")
        .eq("id", booking.equipment_id)
        .single();

      const totalAmount = equipment
        ? equipment.daily_rate * booking.duration_days
        : 0;

      // Create booking
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          client_id: client.id,
          equipment_id: booking.equipment_id,
          start_date: booking.desired_date,
          end_date: new Date(
            new Date(booking.desired_date).getTime() +
              booking.duration_days * 24 * 60 * 60 * 1000,
          )
            .toISOString()
            .split("T")[0],
          start_time: booking.desired_time,
          duration_days: booking.duration_days,
          destination: booking.destination,
          use_case: booking.use_case,
          status: "pending",
          total_amount: totalAmount,
          payment_method: booking.payment_method,
          gratitude_message: booking.gratitude_message,
        })
        .select(
          `
          *,
          clients(name, email, phone),
          equipment(name, type)
        `,
        )
        .single();

      if (error) throw error;

      setBookings((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit booking");
      throw err;
    }
  };

  const approveBooking = async (id: string, adminNotes?: string) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .update({
          status: "approved",
          approval_date: new Date().toISOString(),
          approved_by: "admin", // Replace with actual admin ID
          admin_notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select(
          `
          *,
          clients(name, email, phone),
          equipment(name, type)
        `,
        )
        .single();

      if (error) throw error;
      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? data : booking)),
      );
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to approve booking",
      );
      throw err;
    }
  };

  const rejectBooking = async (id: string, rejectionReason: string) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .update({
          status: "rejected",
          rejection_reason: rejectionReason,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select(
          `
          *,
          clients(name, email, phone),
          equipment(name, type)
        `,
        )
        .single();

      if (error) throw error;
      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? data : booking)),
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject booking");
      throw err;
    }
  };

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    submitClientBooking,
    approveBooking,
    rejectBooking,
  };
}

// Enhanced dashboard analytics
export function useEnhancedDashboard(filters?: FilterOptions) {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    dailyRevenue: 0,
    monthlyRevenue: 0,
    annualRevenue: 0,
    activeBookings: 0,
    pendingBookings: 0,
    totalEquipment: 0,
    availableEquipment: 0,
    clientCount: 0,
    onlineClients: 0,
    utilizationRate: 0,
    monthlyGrowth: 0,
    topEquipment: [],
    topClients: [],
    revenueByPeriod: [],
    equipmentPerformance: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, [filters]);

  const fetchDashboardStats = async () => {
    try {
      // For demo purposes, use sample data instead of database
      await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate API delay

      const bookings = sampleBookings;
      const equipment = sampleEquipment;
      const clients = sampleClients;

      // Calculate revenue metrics
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const yearStart = new Date(now.getFullYear(), 0, 1);

      const completedBookings = bookings.filter(
        (b) => b.status === "completed",
      );

      const totalRevenue = completedBookings.reduce(
        (sum, b) => sum + (b.total_amount || 0),
        0,
      );
      const dailyRevenue = completedBookings
        .filter((b) => new Date(b.created_at) >= today)
        .reduce((sum, b) => sum + (b.total_amount || 0), 0);
      const monthlyRevenue = completedBookings
        .filter((b) => new Date(b.created_at) >= monthStart)
        .reduce((sum, b) => sum + (b.total_amount || 0), 0);
      const annualRevenue = completedBookings
        .filter((b) => new Date(b.created_at) >= yearStart)
        .reduce((sum, b) => sum + (b.total_amount || 0), 0);

      // Calculate other metrics
      const activeBookings = bookings.filter(
        (b) => b.status === "active",
      ).length;
      const pendingBookings = bookings.filter(
        (b) => b.status === "pending",
      ).length;
      const totalEquipment = equipment.length;
      const availableEquipment = equipment.filter(
        (e) => e.availability === "available",
      ).length;
      const clientCount = clients.length;
      const onlineClients = clients.filter((c) => c.is_online).length;

      const rentedEquipment = equipment.filter(
        (e) => e.availability === "rented",
      ).length;
      const utilizationRate =
        totalEquipment > 0
          ? Math.round((rentedEquipment / totalEquipment) * 100)
          : 0;

      // Calculate monthly growth
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      const lastMonthRevenue = completedBookings
        .filter((b) => {
          const date = new Date(b.created_at);
          return date >= lastMonthStart && date <= lastMonthEnd;
        })
        .reduce((sum, b) => sum + (b.total_amount || 0), 0);

      const monthlyGrowth =
        lastMonthRevenue > 0
          ? Math.round(
              ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100,
            )
          : 0;

      // Top equipment by revenue
      const equipmentRevenue = equipment
        .map((eq) => {
          const eqBookings = completedBookings.filter(
            (b) => b.equipment_id === eq.id,
          );
          const revenue = eqBookings.reduce(
            (sum, b) => sum + (b.total_amount || 0),
            0,
          );
          return {
            equipment: eq,
            bookings: eqBookings.length,
            revenue,
          };
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Top clients by spending
      const topClients = clients
        .map((client) => ({
          client,
          totalSpent: client.total_spent || 0,
          bookingCount: client.total_bookings || 0,
        }))
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 5);

      // Revenue by period (last 6 months)
      const revenueByPeriod = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        const periodBookings = completedBookings.filter((b) => {
          const bookingDate = new Date(b.created_at);
          return bookingDate >= date && bookingDate < nextDate;
        });

        revenueByPeriod.push({
          period: date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          revenue: periodBookings.reduce(
            (sum, b) => sum + (b.total_amount || 0),
            0,
          ),
          bookings: periodBookings.length,
        });
      }

      // Equipment performance
      const equipmentPerformance = equipment
        .map((eq) => {
          const eqBookings = bookings.filter((b) => b.equipment_id === eq.id);
          const completedEqBookings = eqBookings.filter(
            (b) => b.status === "completed",
          );
          const revenueGenerated = completedEqBookings.reduce(
            (sum, b) => sum + (b.total_amount || 0),
            0,
          );
          const totalDays = eqBookings.reduce(
            (sum, b) => sum + (b.duration_days || 0),
            0,
          );
          const utilizationRate = (totalDays / 365) * 100; // Rough calculation

          return {
            equipment: eq,
            utilizationRate: Math.min(utilizationRate, 100),
            revenueGenerated,
            maintenanceCost: 0, // Would come from maintenance_records table
          };
        })
        .sort((a, b) => b.revenueGenerated - a.revenueGenerated);

      setStats({
        totalRevenue,
        dailyRevenue,
        monthlyRevenue,
        annualRevenue,
        activeBookings,
        pendingBookings,
        totalEquipment,
        availableEquipment,
        clientCount,
        onlineClients,
        utilizationRate,
        monthlyGrowth,
        topEquipment: equipmentRevenue,
        topClients,
        revenueByPeriod,
        equipmentPerformance,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard stats",
      );
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, fetchDashboardStats };
}

// Business settings management
export function useBusinessSettings() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("business_settings")
        .select("*")
        .limit(1)
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<BusinessSettings>) => {
    try {
      const { data, error } = await supabase
        .from("business_settings")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", settings?.id)
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update settings",
      );
      throw err;
    }
  };

  return { settings, loading, error, updateSettings, fetchSettings };
}

// Messages hook for communication
export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      // For demo purposes, use sample data instead of database
      await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate API delay
      setMessages(sampleMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (
    receiverId: string,
    content: string,
    type: "text" | "image" | "file" = "text",
  ) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: "admin", // Replace with actual sender ID
          receiver_id: receiverId,
          content,
          type,
          status: "sent",
        })
        .select(
          `
          *,
          sender:sender_id(name, avatar_url),
          receiver:receiver_id(name, avatar_url)
        `,
        )
        .single();

      if (error) throw error;
      setMessages((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      throw err;
    }
  };

  return { messages, loading, error, fetchMessages, sendMessage };
}

// Main combined hook for components that need multiple data types
export function useEnhancedSupabase() {
  const equipmentData = useEnhancedEquipment();
  const clientsData = useEnhancedClients();
  const bookingsData = useEnhancedBookings();
  const dashboardData = useEnhancedDashboard();
  const settingsData = useBusinessSettings();

  return {
    // Equipment data
    equipment: equipmentData.equipment,
    equipmentLoading: equipmentData.loading,
    equipmentError: equipmentData.error,
    fetchEquipment: equipmentData.fetchEquipment,
    updateEquipmentLocation: equipmentData.updateEquipmentLocation,
    getEquipmentAvailability: equipmentData.getEquipmentAvailability,

    // Clients data
    clients: clientsData.clients,
    clientsLoading: clientsData.loading,
    clientsError: clientsData.error,
    fetchClients: clientsData.fetchClients,
    updateClientReliability: clientsData.updateClientReliability,

    // Bookings data
    bookings: bookingsData.bookings,
    bookingsLoading: bookingsData.loading,
    bookingsError: bookingsData.error,
    fetchBookings: bookingsData.fetchBookings,
    submitClientBooking: bookingsData.submitClientBooking,
    approveBooking: bookingsData.approveBooking,
    rejectBooking: bookingsData.rejectBooking,
    createBooking: bookingsData.submitClientBooking, // Alias for consistency

    // Dashboard data
    stats: dashboardData.stats,
    dashboardLoading: dashboardData.loading,
    dashboardError: dashboardData.error,
    fetchDashboardStats: dashboardData.fetchDashboardStats,

    // Settings data
    settings: settingsData.settings,
    settingsLoading: settingsData.loading,
    settingsError: settingsData.error,
    updateSettings: settingsData.updateSettings,
    fetchSettings: settingsData.fetchSettings,
  };
}
