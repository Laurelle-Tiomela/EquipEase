export interface Equipment {
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
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  availability: "available" | "rented" | "maintenance";
  imageUrl: string;
  specifications: {
    weight: string;
    power: string;
    capacity: string;
    dimensions: string;
  };
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  registrationDate: string;
  isOnline: boolean;
  lastSeen: string;
  avatar?: string;
}

export interface Booking {
  id: string;
  clientId: string;
  equipmentId: string;
  startDate: string;
  endDate: string;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  totalAmount: number;
  notes?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: "text" | "image" | "file" | "link";
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  activeBookings: number;
  totalEquipment: number;
  clientCount: number;
  utilizationRate: number;
  monthlyGrowth: number;
}

export interface FilterOptions {
  timeRange: "today" | "week" | "month" | "year";
  equipmentType?: Equipment["type"];
  clientId?: string;
  status?: Booking["status"];
}
