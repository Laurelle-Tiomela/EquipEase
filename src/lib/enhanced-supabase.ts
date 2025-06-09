import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ctpfspjokzjrzxduuweg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0cGZzcGlva3pqcnp4ZHV1d2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDY2NTgsImV4cCI6MjA2NDg4MjY1OH0.SZvLkDNu5IltklHdz0NrjouUYPejGWBvzZ7QsBw0oJk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enhanced Database Schema SQL
export const enhancedDatabaseSQL = `
-- Enhanced Equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('excavator', 'crane', 'bulldozer', 'forklift', 'compactor', 'loader', 'generator', 'scaffolding')),
  description TEXT NOT NULL,
  daily_rate DECIMAL(10,2) NOT NULL,
  weekly_rate DECIMAL(10,2) NOT NULL,
  monthly_rate DECIMAL(10,2) NOT NULL,
  availability TEXT NOT NULL DEFAULT 'available' CHECK (availability IN ('available', 'rented', 'maintenance', 'low_stock')),
  available_date DATE,
  image_url TEXT,
  gallery_images JSONB DEFAULT '[]',
  specifications JSONB NOT NULL,
  location JSONB,
  maintenance_schedule JSONB,
  popularity_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  profession TEXT NOT NULL,
  address TEXT NOT NULL,
  registration_date DATE DEFAULT CURRENT_DATE,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  avatar_url TEXT,
  reliability_score INTEGER DEFAULT 5 CHECK (reliability_score >= 1 AND reliability_score <= 10),
  total_bookings INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  preferred_equipment_types JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_days INTEGER NOT NULL,
  destination TEXT NOT NULL,
  use_case TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'completed', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'check')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
  gratitude_message TEXT,
  admin_notes TEXT,
  rejection_reason TEXT,
  contract_url TEXT,
  invoice_url TEXT,
  approval_date TIMESTAMPTZ,
  approved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'image', 'file', 'voice', 'video_call', 'voice_call')),
  file_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  is_read BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  reply_to UUID REFERENCES messages(id),
  call_duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business Settings table
CREATE TABLE IF NOT EXISTS business_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  business_email TEXT NOT NULL,
  business_phone TEXT NOT NULL,
  business_address TEXT NOT NULL,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es', 'fr', 'de')),
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  notification_preferences JSONB DEFAULT '{"email_bookings": true, "sms_bookings": true, "email_payments": true, "maintenance_alerts": true}',
  working_hours JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Data table
CREATE TABLE IF NOT EXISTS analytics_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('revenue', 'bookings', 'equipment_usage', 'client_activity')),
  metric_value DECIMAL(10,2) NOT NULL,
  additional_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Records table
CREATE TABLE IF NOT EXISTS maintenance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL CHECK (maintenance_type IN ('routine', 'repair', 'inspection', 'upgrade')),
  description TEXT NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  performed_by TEXT NOT NULL,
  date_performed DATE NOT NULL,
  next_maintenance_date DATE,
  parts_replaced JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create additional indexes
CREATE INDEX IF NOT EXISTS idx_equipment_popularity ON equipment(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_equipment_location ON equipment USING GIN(location);
CREATE INDEX IF NOT EXISTS idx_clients_reliability ON clients(reliability_score DESC);
CREATE INDEX IF NOT EXISTS idx_clients_total_spent ON clients(total_spent DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_messages_pinned ON messages(is_pinned);
CREATE INDEX IF NOT EXISTS idx_analytics_date_type ON analytics_data(date, metric_type);
CREATE INDEX IF NOT EXISTS idx_maintenance_equipment ON maintenance_records(equipment_id, date_performed);

-- Enable RLS on new tables
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables
CREATE POLICY "Public business_settings access" ON business_settings FOR ALL USING (true);
CREATE POLICY "Public analytics_data access" ON analytics_data FOR ALL USING (true);
CREATE POLICY "Public maintenance_records access" ON maintenance_records FOR ALL USING (true);

-- Update existing tables with new columns (if not exists)
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS available_date DATE;
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]';
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS location JSONB;
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS maintenance_schedule JSONB;
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS popularity_score INTEGER DEFAULT 0;

ALTER TABLE clients ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS profession TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS reliability_score INTEGER DEFAULT 5;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS total_bookings INTEGER DEFAULT 0;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS total_spent DECIMAL(10,2) DEFAULT 0;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS preferred_equipment_types JSONB DEFAULT '[]';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS duration_days INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS destination TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS use_case TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gratitude_message TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS contract_url TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS invoice_url TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS approval_date TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS approved_by TEXT;

ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS reply_to UUID REFERENCES messages(id);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS call_duration INTEGER;

-- Create functions for analytics
CREATE OR REPLACE FUNCTION update_client_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE clients SET 
      total_bookings = (
        SELECT COUNT(*) FROM bookings 
        WHERE client_id = NEW.client_id AND status = 'completed'
      ),
      total_spent = (
        SELECT COALESCE(SUM(total_amount), 0) FROM bookings 
        WHERE client_id = NEW.client_id AND status = 'completed'
      )
    WHERE id = NEW.client_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for client stats
DROP TRIGGER IF EXISTS update_client_stats_trigger ON bookings;
CREATE TRIGGER update_client_stats_trigger
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_client_stats();

-- Create function for equipment popularity
CREATE OR REPLACE FUNCTION update_equipment_popularity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE equipment SET 
      popularity_score = (
        SELECT COUNT(*) FROM bookings 
        WHERE equipment_id = NEW.equipment_id AND status IN ('completed', 'active')
      )
    WHERE id = NEW.equipment_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for equipment popularity
DROP TRIGGER IF EXISTS update_equipment_popularity_trigger ON bookings;
CREATE TRIGGER update_equipment_popularity_trigger
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_equipment_popularity();
`;

// Initialize business settings with default values
export const initializeBusinessSettings = async () => {
  const { data: existing } = await supabase
    .from("business_settings")
    .select("id")
    .limit(1);

  if (!existing || existing.length === 0) {
    await supabase.from("business_settings").insert({
      business_name: "EquipEase Rentals",
      business_email: "contact@equipease.com",
      business_phone: "+1-555-EQUIP",
      business_address: "123 Industrial Ave, City, State 12345",
      theme: "light",
      language: "en",
      currency: "USD",
      timezone: "UTC",
      notification_preferences: {
        email_bookings: true,
        sms_bookings: true,
        email_payments: true,
        maintenance_alerts: true,
      },
      working_hours: {
        monday: { start: "08:00", end: "17:00", closed: false },
        tuesday: { start: "08:00", end: "17:00", closed: false },
        wednesday: { start: "08:00", end: "17:00", closed: false },
        thursday: { start: "08:00", end: "17:00", closed: false },
        friday: { start: "08:00", end: "17:00", closed: false },
        saturday: { start: "09:00", end: "15:00", closed: false },
        sunday: { start: "00:00", end: "00:00", closed: true },
      },
    });
  }
};
