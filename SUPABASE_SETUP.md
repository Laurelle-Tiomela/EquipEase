# Supabase Database Setup for EquipEase

## Quick Setup Instructions

### 1. Create Tables in Supabase

Go to your Supabase project SQL editor and run this SQL:

```sql
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
```

### 2. Initialize Sample Data

After creating the tables, go to the EquipEase homepage and use the **Database Setup** section to populate your database with sample equipment and clients.

### 3. Features Available

Once setup is complete, you'll have access to:

- **Real-time Dashboard** with live analytics
- **Interactive Booking System** with form submissions
- **Live Chat System** with real message storage
- **AI Assistant** that analyzes your actual business data
- **Equipment Management** with availability tracking

### 4. Security Notes

The current setup uses public policies for demonstration. For production:

1. Set up proper authentication
2. Implement Row Level Security policies
3. Restrict table access based on user roles
4. Enable email confirmation and user management

### 5. Real-time Features

The chat system includes real-time message updates using Supabase's real-time subscriptions. Messages appear instantly across all connected clients.

### 6. Data Structure

- **Equipment**: Stores all construction equipment with rates and specifications
- **Clients**: Customer information and online status
- **Bookings**: Rental bookings with dates, amounts, and status
- **Messages**: Chat messages between manager and clients

Your EquipEase application is now connected to a live database and ready for production use!
