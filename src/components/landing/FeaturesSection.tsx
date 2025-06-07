import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageCircle,
  Calendar,
  BarChart3,
  Bot,
  Shield,
  Clock,
  Users,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Real-time Chat",
    description:
      "WhatsApp-like communication with clients. Send messages, images, files, and see online status instantly.",
  },
  {
    icon: Calendar,
    title: "Smart Booking System",
    description:
      "Easy equipment booking with forms, availability tracking, and automated scheduling.",
  },
  {
    icon: BarChart3,
    title: "Live Dashboard",
    description:
      "Real-time analytics with filtering by asset, client, time period, and custom metrics.",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description:
      "Voice and text AI chatbot to answer questions about bookings, clients, and business insights.",
  },
  {
    icon: Shield,
    title: "Secure Database",
    description:
      "Robust data storage with advanced security measures to protect client information.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "System works around the clock to ensure your business never stops.",
  },
  {
    icon: Users,
    title: "Multi-Client Support",
    description:
      "Manage hundreds of clients simultaneously with organized communication channels.",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description:
      "Works perfectly on both web and mobile devices for management on the go.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Equipment Rentals
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From client communication to business analytics, EquipEase provides
            all the tools you need to run a successful equipment rental
            business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-orange-100 hover:border-orange-200 transition-colors"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
