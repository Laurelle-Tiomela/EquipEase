export interface Equipment {
  id: string;
  name: string;
  type:
    | "excavator"
    | "crane"
    | "bulldozer"
    | "forklift"
    | "compactor"
    | "loader"
    | "generator"
    | "scaffolding";
  description: string;
  daily_rate: number;
  weekly_rate: number;
  monthly_rate: number;
  availability: "available" | "rented" | "maintenance" | "low_stock";
  available_date?: string; // When it will be available if currently rented
  image_url: string;
  gallery_images?: string[];
  specifications: {
    weight: string;
    power: string;
    capacity: string;
    dimensions: string;
    fuel_type?: string;
    year?: string;
    brand?: string;
  };
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  maintenance_schedule?: {
    last_service: string;
    next_service: string;
    service_interval_days: number;
  };
  popularity_score: number; // For analytics
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  profession: string;
  address: string;
  registration_date: string;
  is_online: boolean;
  last_seen: string;
  avatar_url?: string;
  reliability_score: number; // 1-10 rating
  total_bookings: number;
  total_spent: number;
  preferred_equipment_types: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  client_id: string;
  equipment_id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  duration_days: number;
  destination: string;
  use_case: string;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "active"
    | "completed"
    | "cancelled";
  total_amount: number;
  payment_method: "cash" | "card" | "bank_transfer" | "check";
  payment_status: "pending" | "partial" | "paid" | "refunded";
  gratitude_message?: string;
  admin_notes?: string;
  rejection_reason?: string;
  contract_url?: string;
  invoice_url?: string;
  approval_date?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  type: "text" | "image" | "file" | "voice" | "video_call" | "voice_call";
  file_url?: string;
  file_name?: string;
  file_size?: number;
  is_read: boolean;
  is_pinned: boolean;
  reply_to?: string; // ID of message being replied to
  call_duration?: number; // For call messages
  created_at: string;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  last_message?: Message;
  unread_count: number;
  is_pinned: boolean;
  updated_at: string;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  business_address: string;
  theme: "light" | "dark";
  language: "en" | "es" | "fr" | "de";
  currency: string;
  timezone: string;
  notification_preferences: {
    email_bookings: boolean;
    sms_bookings: boolean;
    email_payments: boolean;
    maintenance_alerts: boolean;
  };
  working_hours: {
    monday: { start: string; end: string; closed: boolean };
    tuesday: { start: string; end: string; closed: boolean };
    wednesday: { start: string; end: string; closed: boolean };
    thursday: { start: string; end: string; closed: boolean };
    friday: { start: string; end: string; closed: boolean };
    saturday: { start: string; end: string; closed: boolean };
    sunday: { start: string; end: string; closed: boolean };
  };
  created_at: string;
  updated_at: string;
}

export interface AnalyticsData {
  id: string;
  date: string;
  metric_type: "revenue" | "bookings" | "equipment_usage" | "client_activity";
  metric_value: number;
  additional_data?: Record<string, any>;
  created_at: string;
}

export interface MaintenanceRecord {
  id: string;
  equipment_id: string;
  maintenance_type: "routine" | "repair" | "inspection" | "upgrade";
  description: string;
  cost: number;
  performed_by: string;
  date_performed: string;
  next_maintenance_date?: string;
  parts_replaced?: string[];
  created_at: string;
}

// Enhanced Dashboard Stats
export interface DashboardStats {
  totalRevenue: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  annualRevenue: number;
  activeBookings: number;
  pendingBookings: number;
  totalEquipment: number;
  availableEquipment: number;
  clientCount: number;
  onlineClients: number;
  utilizationRate: number;
  monthlyGrowth: number;
  topEquipment: Array<{
    equipment: Equipment;
    bookings: number;
    revenue: number;
  }>;
  topClients: Array<{
    client: Client;
    totalSpent: number;
    bookingCount: number;
  }>;
  revenueByPeriod: Array<{
    period: string;
    revenue: number;
    bookings: number;
  }>;
  equipmentPerformance: Array<{
    equipment: Equipment;
    utilizationRate: number;
    revenueGenerated: number;
    maintenanceCost: number;
  }>;
}

// Client booking form interface
export interface ClientBookingForm {
  client_name: string;
  email: string;
  phone: string;
  profession: string;
  equipment_id: string;
  desired_date: string;
  desired_time: string;
  duration_days: number;
  destination: string;
  use_case: string;
  payment_method: "cash" | "card" | "bank_transfer" | "check";
  gratitude_message?: string;
}

// Equipment availability interface
export interface EquipmentAvailability {
  equipment_id: string;
  available: boolean;
  available_date?: string;
  current_booking?: {
    client_name: string;
    end_date: string;
  };
}

// Filter options interface
export interface FilterOptions {
  status?: string;
  paymentStatus?: string;
  equipmentType?: string;
  timeRange?: "today" | "week" | "month" | "year" | "custom";
  startDate?: string;
  endDate?: string;
  reliabilityScore?: {
    min: number;
    max: number;
  };
}

// Booking form data interface for client forms
export interface BookingFormData {
  clientName: string;
  phone: string;
  email: string;
  profession: string;
  destination: string;
  startDate: string;
  startTime: string;
  duration: number;
  paymentMethod: "cash" | "card";
  gratitudeMessage: string;
}

// GPS tracking data
export interface GPSLocation {
  lat: number;
  lng: number;
  timestamp: string;
  speed?: number;
  heading?: number;
  accuracy?: number;
}

export interface EquipmentGPSData {
  equipment_id: string;
  current_location: GPSLocation;
  last_updated: string;
  status: "online" | "offline" | "low_battery";
  geofence_alerts?: Array<{
    type: "entry" | "exit";
    location: string;
    timestamp: string;
  }>;
}

// Payment interfaces
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: "requires_payment_method" | "succeeded" | "processing" | "canceled";
  client_secret?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Notification interfaces
export interface Notification {
  id: string;
  type: "booking" | "payment" | "maintenance" | "system";
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  created_at: string;
}

// User authentication interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "operator" | "viewer";
  avatar?: string;
  permissions: string[];
  created_at: string;
  last_login?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Equipment category interface
export interface EquipmentCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  equipment_count: number;
}

// Report interfaces
export interface ReportData {
  id: string;
  title: string;
  type: "revenue" | "utilization" | "client_analysis" | "maintenance";
  date_range: {
    start: string;
    end: string;
  };
  data: Record<string, any>;
  generated_at: string;
  generated_by: string;
}

// Export types for forms and API responses
export type CreateEquipmentRequest = Omit<
  Equipment,
  "id" | "created_at" | "updated_at" | "popularity_score"
>;
export type UpdateEquipmentRequest = Partial<CreateEquipmentRequest>;
export type CreateClientRequest = Omit<
  Client,
  | "id"
  | "created_at"
  | "updated_at"
  | "registration_date"
  | "total_bookings"
  | "total_spent"
>;
export type UpdateClientRequest = Partial<CreateClientRequest>;
export type CreateBookingRequest = Omit<
  Booking,
  "id" | "created_at" | "updated_at" | "total_amount"
>;
export type UpdateBookingRequest = Partial<CreateBookingRequest>;
