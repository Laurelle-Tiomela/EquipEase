import { supabase } from "./supabase";

// Sample data to initialize the database
const sampleEquipment = [
  {
    name: "CAT 320 Excavator",
    type: "excavator" as const,
    description: "Heavy-duty excavator perfect for large construction projects",
    daily_rate: 450,
    weekly_rate: 2800,
    monthly_rate: 10500,
    availability: "available" as const,
    image_url: "/placeholder.svg",
    specifications: {
      weight: "20,000 kg",
      power: "121 kW",
      capacity: "1.2 m³",
      dimensions: "9.7m x 2.9m x 3.2m",
    },
  },
  {
    name: "Liebherr LTM 1050",
    type: "crane" as const,
    description: "Mobile crane with excellent lifting capacity",
    daily_rate: 800,
    weekly_rate: 5200,
    monthly_rate: 19500,
    availability: "available" as const,
    image_url: "/placeholder.svg",
    specifications: {
      weight: "36,000 kg",
      power: "360 kW",
      capacity: "50 tons",
      dimensions: "13.5m x 2.7m x 3.8m",
    },
  },
  {
    name: "JCB 3CX Backhoe",
    type: "loader" as const,
    description: "Versatile backhoe loader for medium projects",
    daily_rate: 280,
    weekly_rate: 1750,
    monthly_rate: 6800,
    availability: "available" as const,
    image_url: "/placeholder.svg",
    specifications: {
      weight: "8,500 kg",
      power: "74 kW",
      capacity: "1.0 m³",
      dimensions: "5.9m x 2.3m x 3.7m",
    },
  },
];

const sampleClients = [
  {
    name: "John Smith",
    email: "john.smith@construction.com",
    phone: "+1-555-0123",
    company: "Smith Construction Co.",
    address: "123 Main St, City, State 12345",
    registration_date: "2024-01-15",
    is_online: true,
    last_seen: new Date().toISOString(),
    avatar_url: "/placeholder.svg",
  },
  {
    name: "Maria Rodriguez",
    email: "maria@buildright.com",
    phone: "+1-555-0124",
    company: "BuildRight Inc.",
    address: "456 Oak Ave, City, State 12346",
    registration_date: "2024-02-20",
    is_online: false,
    last_seen: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    avatar_url: "/placeholder.svg",
  },
];

export async function initializeDatabase() {
  try {
    console.log("Initializing database with sample data...");

    // Check if equipment table exists and has data
    const { data: existingEquipment } = await supabase
      .from("equipment")
      .select("id")
      .limit(1);

    if (!existingEquipment || existingEquipment.length === 0) {
      console.log("Adding sample equipment...");
      const { error: equipmentError } = await supabase
        .from("equipment")
        .insert(sampleEquipment);

      if (equipmentError) {
        console.error("Error inserting equipment:", equipmentError);
      } else {
        console.log("Sample equipment added successfully");
      }
    }

    // Check if clients table exists and has data
    const { data: existingClients } = await supabase
      .from("clients")
      .select("id")
      .limit(1);

    if (!existingClients || existingClients.length === 0) {
      console.log("Adding sample clients...");
      const { error: clientsError } = await supabase
        .from("clients")
        .insert(sampleClients);

      if (clientsError) {
        console.error("Error inserting clients:", clientsError);
      } else {
        console.log("Sample clients added successfully");
      }
    }

    console.log("Database initialization completed");
    return true;
  } catch (error) {
    console.error("Database initialization failed:", error);
    return false;
  }
}

// SQL to create tables (run this in Supabase SQL editor)
export const createTablesSQL = `
-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('excavator', 'crane', 'bulldozer', 'forklift', 'compactor', 'loader')),
  description TEXT NOT NULL,
  daily_rate DECIMAL(10,2) NOT NULL,
  weekly_rate DECIMAL(10,2) NOT NULL,
  monthly_rate DECIMAL(10,2) NOT NULL,
  availability TEXT NOT NULL DEFAULT 'available' CHECK (availability IN ('available', 'rented', 'maintenance')),
  image_url TEXT,
  specifications JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL,
  address TEXT NOT NULL,
  registration_date DATE DEFAULT CURRENT_DATE,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'image', 'file', 'link')),
  file_url TEXT,
  file_name TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_equipment_availability ON equipment(availability);
CREATE INDEX IF NOT EXISTS idx_equipment_type ON equipment(type);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_equipment_id ON bookings(equipment_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);

-- Enable RLS on all tables
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust these based on your security needs)
CREATE POLICY "Public equipment access" ON equipment FOR ALL USING (true);
CREATE POLICY "Public clients access" ON clients FOR ALL USING (true);
CREATE POLICY "Public bookings access" ON bookings FOR ALL USING (true);
CREATE POLICY "Public messages access" ON messages FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;
