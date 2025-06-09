import { supabase } from "./enhanced-supabase";

// Sample equipment with real construction equipment images from Unsplash
export const sampleEquipmentData = [
  {
    name: "CAT 320 Excavator",
    type: "excavator" as const,
    description:
      "Heavy-duty hydraulic excavator perfect for large construction projects, demolition, and earthmoving operations.",
    daily_rate: 450,
    weekly_rate: 2800,
    monthly_rate: 10500,
    availability: "available" as const,
    image_url:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop&crop=center",
    gallery_images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1625159230015-49c0ffc3b8ad?w=800&h=600&fit=crop&crop=center",
    ],
    specifications: {
      weight: "20,000 kg",
      power: "121 kW",
      capacity: "1.2 m³",
      dimensions: "9.7m x 2.9m x 3.2m",
      fuel_type: "Diesel",
      year: "2023",
      brand: "Caterpillar",
    },
    location: {
      lat: 40.7128,
      lng: -74.006,
      address: "Construction Site A, New York, NY 10001",
    },
    maintenance_schedule: {
      last_service: "2024-11-15",
      next_service: "2025-02-15",
      service_interval_days: 90,
    },
    popularity_score: 25,
  },
  {
    name: "Liebherr LTM 1050 Mobile Crane",
    type: "crane" as const,
    description:
      "Mobile crane with excellent lifting capacity up to 50 tons, perfect for high-rise construction and heavy lifting operations.",
    daily_rate: 800,
    weekly_rate: 5200,
    monthly_rate: 19500,
    availability: "rented" as const,
    available_date: "2024-12-30",
    image_url:
      "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800&h=600&fit=crop&crop=center",
    gallery_images: [
      "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&h=600&fit=crop&crop=center",
    ],
    specifications: {
      weight: "36,000 kg",
      power: "360 kW",
      capacity: "50 tons",
      dimensions: "13.5m x 2.7m x 3.8m",
      fuel_type: "Diesel",
      year: "2022",
      brand: "Liebherr",
    },
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: "High-Rise Project, Los Angeles, CA 90001",
    },
    maintenance_schedule: {
      last_service: "2024-10-01",
      next_service: "2025-01-01",
      service_interval_days: 90,
    },
    popularity_score: 18,
  },
  {
    name: "JCB 3CX Backhoe Loader",
    type: "loader" as const,
    description:
      "Versatile backhoe loader combining front loader and rear excavator capabilities for medium construction projects.",
    daily_rate: 280,
    weekly_rate: 1750,
    monthly_rate: 6800,
    availability: "available" as const,
    image_url:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop&crop=center",
    gallery_images: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center",
    ],
    specifications: {
      weight: "8,500 kg",
      power: "74 kW",
      capacity: "1.0 m³",
      dimensions: "5.9m x 2.3m x 3.7m",
      fuel_type: "Diesel",
      year: "2023",
      brand: "JCB",
    },
    location: {
      lat: 41.8781,
      lng: -87.6298,
      address: "Residential Development, Chicago, IL 60601",
    },
    maintenance_schedule: {
      last_service: "2024-12-01",
      next_service: "2025-03-01",
      service_interval_days: 90,
    },
    popularity_score: 22,
  },
  {
    name: "Komatsu D65 Bulldozer",
    type: "bulldozer" as const,
    description:
      "Powerful bulldozer for earthmoving, grading, and site preparation with advanced GPS guidance system.",
    daily_rate: 520,
    weekly_rate: 3200,
    monthly_rate: 12000,
    availability: "available" as const,
    image_url:
      "https://images.unsplash.com/photo-1625159230015-49c0ffc3b8ad?w=800&h=600&fit=crop&crop=center",
    gallery_images: [
      "https://images.unsplash.com/photo-1625159230015-49c0ffc3b8ad?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800&h=600&fit=crop&crop=center",
    ],
    specifications: {
      weight: "18,500 kg",
      power: "142 kW",
      capacity: "3.8 m³",
      dimensions: "6.2m x 3.1m x 3.5m",
      fuel_type: "Diesel",
      year: "2023",
      brand: "Komatsu",
    },
    location: {
      lat: 29.7604,
      lng: -95.3698,
      address: "Highway Extension Project, Houston, TX 77001",
    },
    maintenance_schedule: {
      last_service: "2024-11-20",
      next_service: "2025-02-20",
      service_interval_days: 90,
    },
    popularity_score: 15,
  },
  {
    name: "Caterpillar 950 Wheel Loader",
    type: "loader" as const,
    description:
      "High-performance wheel loader for material handling, loading trucks, and stockpile management.",
    daily_rate: 380,
    weekly_rate: 2400,
    monthly_rate: 9200,
    availability: "maintenance" as const,
    available_date: "2024-12-28",
    image_url:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&crop=center",
    gallery_images: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center",
    ],
    specifications: {
      weight: "16,800 kg",
      power: "164 kW",
      capacity: "2.3 m³",
      dimensions: "7.8m x 2.6m x 3.4m",
      fuel_type: "Diesel",
      year: "2022",
      brand: "Caterpillar",
    },
    location: {
      lat: 33.4484,
      lng: -112.074,
      address: "Mining Site, Phoenix, AZ 85001",
    },
    maintenance_schedule: {
      last_service: "2024-12-15",
      next_service: "2025-03-15",
      service_interval_days: 90,
    },
    popularity_score: 12,
  },
];

// Sample clients with realistic information
export const sampleClientsData = [
  {
    name: "John Smith",
    email: "john.smith@smithconstruction.com",
    phone: "+1-555-0123",
    company: "Smith Construction Co.",
    profession: "Construction Manager",
    address: "123 Main St, New York, NY 10001",
    registration_date: "2024-01-15",
    is_online: true,
    last_seen: new Date().toISOString(),
    avatar_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    reliability_score: 9,
    total_bookings: 15,
    total_spent: 45600,
    preferred_equipment_types: ["excavator", "bulldozer"],
    notes:
      "Long-term client, always pays on time. Prefers early morning deliveries.",
  },
  {
    name: "Maria Rodriguez",
    email: "maria@buildright.com",
    phone: "+1-555-0124",
    company: "BuildRight Inc.",
    profession: "Project Manager",
    address: "456 Oak Ave, Los Angeles, CA 90001",
    registration_date: "2024-02-20",
    is_online: false,
    last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    avatar_url:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    reliability_score: 8,
    total_bookings: 12,
    total_spent: 38200,
    preferred_equipment_types: ["crane", "loader"],
    notes:
      "Specializes in high-rise construction. Requires insurance certificates.",
  },
  {
    name: "David Chen",
    email: "david@metrobuilders.com",
    phone: "+1-555-0125",
    company: "Metro Builders LLC",
    profession: "Civil Engineer",
    address: "789 Pine St, Chicago, IL 60601",
    registration_date: "2024-03-10",
    is_online: true,
    last_seen: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    avatar_url:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    reliability_score: 10,
    total_bookings: 8,
    total_spent: 28900,
    preferred_equipment_types: ["excavator", "compactor"],
    notes:
      "Very detail-oriented, excellent communication. Prefers digital contracts.",
  },
  {
    name: "Sarah Johnson",
    email: "sarah@pioneerdevelopment.com",
    phone: "+1-555-0126",
    company: "Pioneer Development",
    profession: "Site Supervisor",
    address: "321 Elm Dr, Houston, TX 77001",
    registration_date: "2024-03-25",
    is_online: false,
    last_seen: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    avatar_url:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    reliability_score: 7,
    total_bookings: 6,
    total_spent: 19500,
    preferred_equipment_types: ["bulldozer", "loader"],
    notes:
      "New client, handles residential developments. Prefers weekend deliveries.",
  },
  {
    name: "Michael Thompson",
    email: "mike@apexconstruction.com",
    phone: "+1-555-0127",
    company: "Apex Construction Group",
    profession: "Operations Manager",
    address: "654 Maple Ave, Phoenix, AZ 85001",
    registration_date: "2024-04-05",
    is_online: true,
    last_seen: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    avatar_url:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    reliability_score: 9,
    total_bookings: 10,
    total_spent: 32100,
    preferred_equipment_types: ["crane", "excavator"],
    notes:
      "Large commercial projects. Requires 24-hour advance notice for deliveries.",
  },
  {
    name: "Jennifer Wilson",
    email: "jen@wilsonenterprises.com",
    phone: "+1-555-0128",
    company: "Wilson Enterprises",
    profession: "General Contractor",
    address: "987 Cedar Ln, Seattle, WA 98101",
    registration_date: "2024-04-20",
    is_online: false,
    last_seen: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    avatar_url:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    reliability_score: 8,
    total_bookings: 7,
    total_spent: 24800,
    preferred_equipment_types: ["loader", "compactor"],
    notes:
      "Environmental projects focus. Requires low-emission equipment when available.",
  },
  {
    name: "Robert Brown",
    email: "rob@browndemolition.com",
    phone: "+1-555-0129",
    company: "Brown Demolition Services",
    profession: "Demolition Specialist",
    address: "147 Oak St, Denver, CO 80201",
    registration_date: "2024-05-01",
    is_online: true,
    last_seen: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    avatar_url:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    reliability_score: 6,
    total_bookings: 4,
    total_spent: 16200,
    preferred_equipment_types: ["excavator", "bulldozer"],
    notes:
      "Demolition specialist. Requires specialized attachments. Safety protocols important.",
  },
  {
    name: "Lisa Anderson",
    email: "lisa@greenbuild.com",
    phone: "+1-555-0130",
    company: "GreenBuild Solutions",
    profession: "Sustainable Construction Manager",
    address: "258 Birch Rd, Portland, OR 97201",
    registration_date: "2024-05-15",
    is_online: false,
    last_seen: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    avatar_url:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    reliability_score: 9,
    total_bookings: 5,
    total_spent: 18700,
    preferred_equipment_types: ["loader", "compactor"],
    notes:
      "LEED certified projects. Prefers hybrid/electric equipment when available.",
  },
  {
    name: "Carlos Martinez",
    email: "carlos@premierconstruct.com",
    phone: "+1-555-0131",
    company: "Premier Construction",
    profession: "Heavy Equipment Operator",
    address: "369 Pine Ave, Miami, FL 33101",
    registration_date: "2024-06-01",
    is_online: true,
    last_seen: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    avatar_url:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    reliability_score: 8,
    total_bookings: 9,
    total_spent: 27300,
    preferred_equipment_types: ["crane", "excavator"],
    notes:
      "Experienced operator. Handles complex projects. Prefers newer model equipment.",
  },
  {
    name: "Amanda Davis",
    email: "amanda@urbandev.com",
    phone: "+1-555-0132",
    company: "Urban Development Corp",
    profession: "Development Coordinator",
    address: "741 Spruce St, Boston, MA 02101",
    registration_date: "2024-06-20",
    is_online: false,
    last_seen: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    avatar_url:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
    reliability_score: 7,
    total_bookings: 3,
    total_spent: 12400,
    preferred_equipment_types: ["bulldozer", "loader"],
    notes:
      "Urban redevelopment projects. Tight schedules, flexible with equipment options.",
  },
];

// Sample bookings to demonstrate the MIS
export const sampleBookingsData = [
  {
    client_email: "john.smith@smithconstruction.com",
    equipment_name: "CAT 320 Excavator",
    start_date: "2024-12-20",
    end_date: "2024-12-27",
    start_time: "08:00",
    duration_days: 7,
    destination: "123 Construction Site, New York, NY",
    use_case: "Foundation excavation for new commercial building",
    status: "active" as const,
    total_amount: 3150,
    payment_method: "card" as const,
    payment_status: "paid" as const,
    gratitude_message: "Thank you for the reliable service!",
    approval_date: "2024-12-18T10:30:00Z",
    approved_by: "admin",
  },
  {
    client_email: "maria@buildright.com",
    equipment_name: "Liebherr LTM 1050 Mobile Crane",
    start_date: "2024-12-25",
    end_date: "2024-12-31",
    start_time: "07:00",
    duration_days: 6,
    destination: "456 High-Rise Project, Los Angeles, CA",
    use_case: "Steel beam installation for 15-story building",
    status: "active" as const,
    total_amount: 4800,
    payment_method: "bank_transfer" as const,
    payment_status: "paid" as const,
    gratitude_message: "Perfect crane for our high-rise project.",
    approval_date: "2024-12-20T14:15:00Z",
    approved_by: "admin",
  },
  {
    client_email: "david@metrobuilders.com",
    equipment_name: "JCB 3CX Backhoe Loader",
    start_date: "2024-12-28",
    end_date: "2025-01-05",
    start_time: "09:00",
    duration_days: 8,
    destination: "789 Residential Development, Chicago, IL",
    use_case: "Utility line installation and landscaping work",
    status: "confirmed" as const,
    total_amount: 2240,
    payment_method: "check" as const,
    payment_status: "pending" as const,
    gratitude_message: "Looking forward to working with your equipment.",
    approval_date: "2024-12-22T11:45:00Z",
    approved_by: "admin",
  },
  {
    client_email: "sarah@pioneerdevelopment.com",
    equipment_name: "Komatsu D65 Bulldozer",
    start_date: "2025-01-02",
    end_date: "2025-01-10",
    start_time: "08:30",
    duration_days: 8,
    destination: "321 Residential Project, Houston, TX",
    use_case: "Site preparation and grading for new subdivision",
    status: "pending" as const,
    total_amount: 4160,
    payment_method: "card" as const,
    payment_status: "pending" as const,
    gratitude_message: "We appreciate your competitive pricing!",
  },
  {
    client_email: "mike@apexconstruction.com",
    equipment_name: "CAT 320 Excavator",
    start_date: "2024-12-15",
    end_date: "2024-12-22",
    start_time: "07:30",
    duration_days: 7,
    destination: "654 Commercial Complex, Phoenix, AZ",
    use_case: "Parking lot excavation and storm drain installation",
    status: "completed" as const,
    total_amount: 3150,
    payment_method: "bank_transfer" as const,
    payment_status: "paid" as const,
    gratitude_message: "Excellent equipment and service as always.",
    approval_date: "2024-12-12T09:20:00Z",
    approved_by: "admin",
  },
  {
    client_email: "jen@wilsonenterprises.com",
    equipment_name: "Caterpillar 950 Wheel Loader",
    start_date: "2024-12-10",
    end_date: "2024-12-17",
    start_time: "08:00",
    duration_days: 7,
    destination: "987 Environmental Site, Seattle, WA",
    use_case: "Material handling for soil remediation project",
    status: "completed" as const,
    total_amount: 2660,
    payment_method: "card" as const,
    payment_status: "paid" as const,
    gratitude_message: "Great for our environmental project needs.",
    approval_date: "2024-12-08T13:10:00Z",
    approved_by: "admin",
  },
  {
    client_email: "rob@browndemolition.com",
    equipment_name: "CAT 320 Excavator",
    start_date: "2025-01-05",
    end_date: "2025-01-12",
    start_time: "06:00",
    duration_days: 7,
    destination: "147 Demolition Site, Denver, CO",
    use_case: "Building demolition and debris removal",
    status: "pending" as const,
    total_amount: 3150,
    payment_method: "cash" as const,
    payment_status: "pending" as const,
    gratitude_message:
      "Need reliable equipment for safety-critical demolition.",
  },
  {
    client_email: "lisa@greenbuild.com",
    equipment_name: "JCB 3CX Backhoe Loader",
    start_date: "2024-12-30",
    end_date: "2025-01-08",
    start_time: "09:30",
    duration_days: 9,
    destination: "258 Green Development, Portland, OR",
    use_case: "Sustainable landscaping and rain garden installation",
    status: "confirmed" as const,
    total_amount: 2520,
    payment_method: "bank_transfer" as const,
    payment_status: "partial" as const,
    gratitude_message: "Perfect for our LEED certified project.",
    approval_date: "2024-12-23T16:30:00Z",
    approved_by: "admin",
  },
  {
    client_email: "carlos@premierconstruct.com",
    equipment_name: "Liebherr LTM 1050 Mobile Crane",
    start_date: "2024-11-25",
    end_date: "2024-12-05",
    start_time: "07:00",
    duration_days: 10,
    destination: "369 Marina Project, Miami, FL",
    use_case: "Precast concrete panel installation for marina facility",
    status: "completed" as const,
    total_amount: 8000,
    payment_method: "bank_transfer" as const,
    payment_status: "paid" as const,
    gratitude_message: "Exceptional crane performance on our marine project.",
    approval_date: "2024-11-20T12:45:00Z",
    approved_by: "admin",
  },
  {
    client_email: "amanda@urbandev.com",
    equipment_name: "Komatsu D65 Bulldozer",
    start_date: "2025-01-10",
    end_date: "2025-01-17",
    start_time: "08:00",
    duration_days: 7,
    destination: "741 Urban Renewal, Boston, MA",
    use_case: "Site clearing and preparation for mixed-use development",
    status: "pending" as const,
    total_amount: 3640,
    payment_method: "card" as const,
    payment_status: "pending" as const,
    gratitude_message:
      "Looking forward to working together on this urban project.",
  },
];

// Function to initialize all sample data
export async function initializeSampleData() {
  try {
    console.log("Initializing comprehensive sample data...");

    // Add sample equipment
    console.log("Adding sample equipment...");
    for (const equipment of sampleEquipmentData) {
      const { error } = await supabase.from("equipment").insert([equipment]);
      if (error) {
        console.error("Error inserting equipment:", error);
      }
    }

    // Add sample clients
    console.log("Adding sample clients...");
    for (const client of sampleClientsData) {
      const { error } = await supabase.from("clients").insert([client]);
      if (error) {
        console.error("Error inserting client:", error);
      }
    }

    // Add sample bookings
    console.log("Adding sample bookings...");
    for (const bookingData of sampleBookingsData) {
      // First, get the client and equipment IDs
      const { data: client } = await supabase
        .from("clients")
        .select("id")
        .eq("email", bookingData.client_email)
        .single();

      const { data: equipment } = await supabase
        .from("equipment")
        .select("id")
        .eq("name", bookingData.equipment_name)
        .single();

      if (client && equipment) {
        const booking = {
          client_id: client.id,
          equipment_id: equipment.id,
          start_date: bookingData.start_date,
          end_date: bookingData.end_date,
          start_time: bookingData.start_time,
          duration_days: bookingData.duration_days,
          destination: bookingData.destination,
          use_case: bookingData.use_case,
          status: bookingData.status,
          total_amount: bookingData.total_amount,
          payment_method: bookingData.payment_method,
          payment_status: bookingData.payment_status,
          gratitude_message: bookingData.gratitude_message,
          approval_date: bookingData.approval_date,
          approved_by: bookingData.approved_by,
        };

        const { error } = await supabase.from("bookings").insert([booking]);
        if (error) {
          console.error("Error inserting booking:", error);
        }
      }
    }

    // Add some sample messages
    console.log("Adding sample messages...");
    const sampleMessages = [
      {
        sender_id: sampleClientsData[0].email.replace("@", "_at_"),
        receiver_id: "manager",
        content: "Hi, I need to discuss the excavator rental for next week.",
        type: "text",
        is_read: true,
      },
      {
        sender_id: "manager",
        receiver_id: sampleClientsData[0].email.replace("@", "_at_"),
        content:
          "Hello John! I'd be happy to help. What specific dates are you looking at?",
        type: "text",
        is_read: true,
      },
      {
        sender_id: sampleClientsData[1].email.replace("@", "_at_"),
        receiver_id: "manager",
        content:
          "The crane performed excellently on our last project. Thank you!",
        type: "text",
        is_read: false,
      },
    ];

    for (const message of sampleMessages) {
      const { error } = await supabase.from("messages").insert([message]);
      if (error) {
        console.error("Error inserting message:", error);
      }
    }

    console.log("✅ Sample data initialization completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Sample data initialization failed:", error);
    return false;
  }
}
