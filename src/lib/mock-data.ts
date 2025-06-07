import {
  Equipment,
  Client,
  Booking,
  Message,
  ChatRoom,
  DashboardStats,
} from "./types";

export const mockEquipment: Equipment[] = [
  {
    id: "1",
    name: "CAT 320 Excavator",
    type: "excavator",
    description: "Heavy-duty excavator perfect for large construction projects",
    dailyRate: 450,
    weeklyRate: 2800,
    monthlyRate: 10500,
    availability: "available",
    imageUrl: "/placeholder.svg",
    specifications: {
      weight: "20,000 kg",
      power: "121 kW",
      capacity: "1.2 m³",
      dimensions: "9.7m x 2.9m x 3.2m",
    },
  },
  {
    id: "2",
    name: "Liebherr LTM 1050",
    type: "crane",
    description: "Mobile crane with excellent lifting capacity",
    dailyRate: 800,
    weeklyRate: 5200,
    monthlyRate: 19500,
    availability: "rented",
    imageUrl: "/placeholder.svg",
    specifications: {
      weight: "36,000 kg",
      power: "360 kW",
      capacity: "50 tons",
      dimensions: "13.5m x 2.7m x 3.8m",
    },
  },
  {
    id: "3",
    name: "JCB 3CX Backhoe",
    type: "loader",
    description: "Versatile backhoe loader for medium projects",
    dailyRate: 280,
    weeklyRate: 1750,
    monthlyRate: 6800,
    availability: "available",
    imageUrl: "/placeholder.svg",
    specifications: {
      weight: "8,500 kg",
      power: "74 kW",
      capacity: "1.0 m³",
      dimensions: "5.9m x 2.3m x 3.7m",
    },
  },
];

export const mockClients: Client[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@construction.com",
    phone: "+1-555-0123",
    company: "Smith Construction Co.",
    address: "123 Main St, City, State 12345",
    registrationDate: "2024-01-15",
    isOnline: true,
    lastSeen: "2024-12-26T10:30:00Z",
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    email: "maria@buildright.com",
    phone: "+1-555-0124",
    company: "BuildRight Inc.",
    address: "456 Oak Ave, City, State 12346",
    registrationDate: "2024-02-20",
    isOnline: false,
    lastSeen: "2024-12-25T15:45:00Z",
    avatar: "/placeholder.svg",
  },
];

export const mockBookings: Booking[] = [
  {
    id: "1",
    clientId: "1",
    equipmentId: "1",
    startDate: "2024-12-28",
    endDate: "2025-01-05",
    status: "confirmed",
    totalAmount: 3600,
    notes: "Need early morning delivery",
    createdAt: "2024-12-20T09:00:00Z",
  },
  {
    id: "2",
    clientId: "2",
    equipmentId: "2",
    startDate: "2024-12-25",
    endDate: "2024-12-31",
    status: "active",
    totalAmount: 5600,
    createdAt: "2024-12-18T14:30:00Z",
  },
];

export const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "1",
    receiverId: "manager",
    content: "Hi, I need to discuss the excavator rental for next week.",
    timestamp: "2024-12-26T10:30:00Z",
    type: "text",
    isRead: true,
  },
  {
    id: "2",
    senderId: "manager",
    receiverId: "1",
    content:
      "Hello John! I'd be happy to help. What specific dates are you looking at?",
    timestamp: "2024-12-26T10:32:00Z",
    type: "text",
    isRead: true,
  },
];

export const mockChatRooms: ChatRoom[] = [
  {
    id: "1",
    participants: ["1", "manager"],
    lastMessage: mockMessages[1],
    unreadCount: 0,
    updatedAt: "2024-12-26T10:32:00Z",
  },
  {
    id: "2",
    participants: ["2", "manager"],
    unreadCount: 2,
    updatedAt: "2024-12-25T15:45:00Z",
  },
];

export const mockDashboardStats: DashboardStats = {
  totalRevenue: 125400,
  activeBookings: 8,
  totalEquipment: 24,
  clientCount: 45,
  utilizationRate: 78,
  monthlyGrowth: 12.5,
};
