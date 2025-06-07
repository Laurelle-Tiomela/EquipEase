import { createClient } from "@supabase/supabase-js";

// Extract the project reference from the JWT token
const supabaseUrl = "https://ctpfspjokzjrzxduuweg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0cGZzcGlva3pqcnp4ZHV1d2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDY2NTgsImV4cCI6MjA2NDg4MjY1OH0.SZvLkDNu5IltklHdz0NrjouUYPejGWBvzZ7QsBw0oJk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for EquipEase
export interface Database {
  public: {
    Tables: {
      equipment: {
        Row: {
          id: string;
          name: string;
          type:
            | "excavator"
            | "crane"
            | "bulldozer"
            | "forklift"
            | "compactor"
            | "loader";
          description: string;
          daily_rate: number;
          weekly_rate: number;
          monthly_rate: number;
          availability: "available" | "rented" | "maintenance";
          image_url: string;
          specifications: {
            weight: string;
            power: string;
            capacity: string;
            dimensions: string;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type:
            | "excavator"
            | "crane"
            | "bulldozer"
            | "forklift"
            | "compactor"
            | "loader";
          description: string;
          daily_rate: number;
          weekly_rate: number;
          monthly_rate: number;
          availability?: "available" | "rented" | "maintenance";
          image_url: string;
          specifications: {
            weight: string;
            power: string;
            capacity: string;
            dimensions: string;
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?:
            | "excavator"
            | "crane"
            | "bulldozer"
            | "forklift"
            | "compactor"
            | "loader";
          description?: string;
          daily_rate?: number;
          weekly_rate?: number;
          monthly_rate?: number;
          availability?: "available" | "rented" | "maintenance";
          image_url?: string;
          specifications?: {
            weight: string;
            power: string;
            capacity: string;
            dimensions: string;
          };
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          company: string;
          address: string;
          registration_date: string;
          is_online: boolean;
          last_seen: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          company: string;
          address: string;
          registration_date?: string;
          is_online?: boolean;
          last_seen?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          company?: string;
          address?: string;
          registration_date?: string;
          is_online?: boolean;
          last_seen?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          client_id: string;
          equipment_id: string;
          start_date: string;
          end_date: string;
          status:
            | "pending"
            | "confirmed"
            | "active"
            | "completed"
            | "cancelled";
          total_amount: number;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          equipment_id: string;
          start_date: string;
          end_date: string;
          status?:
            | "pending"
            | "confirmed"
            | "active"
            | "completed"
            | "cancelled";
          total_amount: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          equipment_id?: string;
          start_date?: string;
          end_date?: string;
          status?:
            | "pending"
            | "confirmed"
            | "active"
            | "completed"
            | "cancelled";
          total_amount?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          timestamp: string;
          type: "text" | "image" | "file" | "link";
          file_url?: string;
          file_name?: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          timestamp?: string;
          type?: "text" | "image" | "file" | "link";
          file_url?: string;
          file_name?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          timestamp?: string;
          type?: "text" | "image" | "file" | "link";
          file_url?: string;
          file_name?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
