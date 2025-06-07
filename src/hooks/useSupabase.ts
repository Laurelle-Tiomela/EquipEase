import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type Equipment = Database["public"]["Tables"]["equipment"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];
type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];

// Equipment hooks
export function useEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEquipment() {
      try {
        const { data, error } = await supabase
          .from("equipment")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setEquipment(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchEquipment();
  }, []);

  const addEquipment = async (
    newEquipment: Database["public"]["Tables"]["equipment"]["Insert"],
  ) => {
    try {
      const { data, error } = await supabase
        .from("equipment")
        .insert([newEquipment])
        .select()
        .single();

      if (error) throw error;
      setEquipment((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add equipment");
      throw err;
    }
  };

  const updateEquipment = async (
    id: string,
    updates: Database["public"]["Tables"]["equipment"]["Update"],
  ) => {
    try {
      const { data, error } = await supabase
        .from("equipment")
        .update({ ...updates, updated_at: new Date().toISOString() })
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
        err instanceof Error ? err.message : "Failed to update equipment",
      );
      throw err;
    }
  };

  return { equipment, loading, error, addEquipment, updateEquipment };
}

// Clients hooks
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setClients(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  const addClient = async (
    newClient: Database["public"]["Tables"]["clients"]["Insert"],
  ) => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .insert([newClient])
        .select()
        .single();

      if (error) throw error;
      setClients((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add client");
      throw err;
    }
  };

  return { clients, loading, error, addClient };
}

// Bookings hooks
export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setBookings(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  const addBooking = async (
    newBooking: Database["public"]["Tables"]["bookings"]["Insert"],
  ) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert([newBooking])
        .select()
        .single();

      if (error) throw error;
      setBookings((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add booking");
      throw err;
    }
  };

  const updateBookingStatus = async (id: string, status: Booking["status"]) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? data : booking)),
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update booking");
      throw err;
    }
  };

  return { bookings, loading, error, addBooking, updateBookingStatus };
}

// Messages hooks
export function useMessages(roomId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    async function fetchMessages() {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(`sender_id.eq.${roomId},receiver_id.eq.${roomId}`)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (
            newMessage.sender_id === roomId ||
            newMessage.receiver_id === roomId
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const sendMessage = async (
    newMessage: Database["public"]["Tables"]["messages"]["Insert"],
  ) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert([newMessage])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      throw err;
    }
  };

  return { messages, loading, error, sendMessage };
}

// Dashboard analytics hook
export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeBookings: 0,
    totalEquipment: 0,
    clientCount: 0,
    utilizationRate: 0,
    monthlyGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        // Fetch all data needed for calculations
        const [bookingsResult, equipmentResult, clientsResult] =
          await Promise.all([
            supabase
              .from("bookings")
              .select("total_amount, status, created_at"),
            supabase.from("equipment").select("id, availability"),
            supabase.from("clients").select("id, created_at"),
          ]);

        if (bookingsResult.error) throw bookingsResult.error;
        if (equipmentResult.error) throw equipmentResult.error;
        if (clientsResult.error) throw clientsResult.error;

        const bookings = bookingsResult.data || [];
        const equipment = equipmentResult.data || [];
        const clients = clientsResult.data || [];

        // Calculate stats
        const totalRevenue = bookings
          .filter((b) => b.status === "completed")
          .reduce((sum, b) => sum + (b.total_amount || 0), 0);

        const activeBookings = bookings.filter(
          (b) => b.status === "active" || b.status === "confirmed",
        ).length;

        const totalEquipment = equipment.length;
        const clientCount = clients.length;

        const rentedEquipment = equipment.filter(
          (e) => e.availability === "rented",
        ).length;
        const utilizationRate =
          totalEquipment > 0
            ? Math.round((rentedEquipment / totalEquipment) * 100)
            : 0;

        // Calculate monthly growth (simplified - comparing last 30 days to previous 30 days)
        const now = new Date();
        const thirtyDaysAgo = new Date(
          now.getTime() - 30 * 24 * 60 * 60 * 1000,
        );
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const recentRevenue = bookings
          .filter(
            (b) =>
              b.status === "completed" &&
              new Date(b.created_at) >= thirtyDaysAgo,
          )
          .reduce((sum, b) => sum + (b.total_amount || 0), 0);

        const previousRevenue = bookings
          .filter(
            (b) =>
              b.status === "completed" &&
              new Date(b.created_at) >= sixtyDaysAgo &&
              new Date(b.created_at) < thirtyDaysAgo,
          )
          .reduce((sum, b) => sum + (b.total_amount || 0), 0);

        const monthlyGrowth =
          previousRevenue > 0
            ? Math.round(
                ((recentRevenue - previousRevenue) / previousRevenue) * 100,
              )
            : 0;

        setStats({
          totalRevenue,
          activeBookings,
          totalEquipment,
          clientCount,
          utilizationRate,
          monthlyGrowth,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch dashboard stats",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  return { stats, loading, error };
}
