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

export interface FilterOptions {
  timeRange: "today" | "week" | "month" | "year" | "custom";
  startDate?: string;
  endDate?: string;
  equipmentType?: Equipment["type"];
  clientId?: string;
  status?: Booking["status"];
  reliabilityScore?: { min: number; max: number };
  paymentStatus?: Booking["payment_status"];
  rentalDuration?: { min: number; max: number };
}

// Client Website Types
export interface ClientBookingForm {
  client_name: string;
  phone: string;
  email: string;
  profession: string;
  destination: string;
  use_case: string;
  desired_date: string;
  desired_time: string;
  duration_days: number;
  payment_method: Booking["payment_method"];
  gratitude_message?: string;
  equipment_id: string;
}

export interface EquipmentAvailability {
  equipment_id: string;
  available: boolean;
  available_date?: string;
  next_available_time?: string;
  current_booking?: {
    client_name: string;
    end_date: string;
  };
}
