import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Loader2,
  BarChart3,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useDashboardStats,
  useBookings,
  useClients,
  useEquipment,
} from "@/hooks/useSupabase";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  type?: "text" | "chart" | "data";
}

const suggestionPrompts = [
  {
    icon: BarChart3,
    title: "Revenue Analysis",
    prompt: "Show me this month's revenue compared to last month",
  },
  {
    icon: Users,
    title: "Client Overview",
    prompt: "How many active clients do we have and who are the top 5?",
  },
  {
    icon: Calendar,
    title: "Booking Status",
    prompt: "What bookings do we have for next week?",
  },
  {
    icon: DollarSign,
    title: "Profitability",
    prompt: "Which equipment generates the most profit?",
  },
];

export function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI business assistant. I can help you analyze your equipment rental business, answer questions about bookings, clients, and provide insights. What would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Get real data from Supabase
  const { stats } = useDashboardStats();
  const { bookings } = useBookings();
  const { clients } = useClients();
  const { equipment } = useEquipment();

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (
      lowerQuery.includes("revenue") ||
      lowerQuery.includes("money") ||
      lowerQuery.includes("profit")
    ) {
      const completedBookings = bookings.filter(
        (b) => b.status === "completed",
      );
      const totalRevenue = completedBookings.reduce(
        (sum, b) => sum + b.total_amount,
        0,
      );
      const avgBookingValue =
        completedBookings.length > 0
          ? totalRevenue / completedBookings.length
          : 0;

      return `Based on your current data, your total revenue is $${totalRevenue.toLocaleString()} from ${completedBookings.length} completed bookings. The average booking value is $${avgBookingValue.toFixed(0)}. Your monthly growth rate is ${stats.monthlyGrowth}%.`;
    }

    if (lowerQuery.includes("client") || lowerQuery.includes("customer")) {
      const activeClients = clients.filter((c) => c.is_online);
      const clientsWithBookings = new Set(bookings.map((b) => b.client_id))
        .size;

      return `You currently have ${clients.length} total clients, with ${activeClients.length} currently online. ${clientsWithBookings} clients have active or completed bookings. Recent client activity shows good engagement with your services.`;
    }

    if (
      lowerQuery.includes("booking") ||
      lowerQuery.includes("schedule") ||
      lowerQuery.includes("rental")
    ) {
      const activeBookings = bookings.filter(
        (b) => b.status === "active" || b.status === "confirmed",
      );
      const pendingBookings = bookings.filter((b) => b.status === "pending");

      return `You have ${activeBookings.length} active bookings currently running and ${pendingBookings.length} pending bookings awaiting confirmation. Your equipment utilization rate is ${stats.utilizationRate}%. Total bookings in the system: ${bookings.length}.`;
    }

    if (lowerQuery.includes("equipment") || lowerQuery.includes("machinery")) {
      const availableEquipment = equipment.filter(
        (e) => e.availability === "available",
      );
      const rentedEquipment = equipment.filter(
        (e) => e.availability === "rented",
      );
      const maintenanceEquipment = equipment.filter(
        (e) => e.availability === "maintenance",
      );

      const equipmentByType = equipment.reduce(
        (acc, eq) => {
          acc[eq.type] = (acc[eq.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const typeBreakdown = Object.entries(equipmentByType)
        .map(([type, count]) => `${count} ${type}s`)
        .join(", ");

      return `Your fleet consists of ${equipment.length} equipment units: ${typeBreakdown}. Currently: ${availableEquipment.length} available, ${rentedEquipment.length} rented, ${maintenanceEquipment.length} under maintenance. Utilization rate: ${stats.utilizationRate}%.`;
    }

    if (equipment.length === 0 && clients.length === 0) {
      return "It looks like your database hasn't been set up yet. Please use the Database Setup section on the homepage to initialize your system with sample data, or add your own equipment and clients through the application.";
    }

    return "I can help you with information about your revenue, clients, bookings, and equipment. Try asking specific questions like 'How much revenue did we generate?' or 'Which clients have active bookings?' You can also ask for comparisons, trends, or specific data analysis.";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(inputValue),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (prompt: string) => {
    setInputValue(prompt);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Here you would implement actual voice recording
    if (!isRecording) {
      // Start recording
      setTimeout(() => {
        setIsRecording(false);
        setInputValue("What's our revenue performance this month?");
      }, 3000);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Suggestions Panel */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
          <CardDescription>
            Common questions you can ask the AI assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestionPrompts.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left h-auto p-4 justify-start"
                onClick={() => handleSuggestionClick(suggestion.prompt)}
              >
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <div className="font-medium">{suggestion.title}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {suggestion.prompt}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}

          {/* Data Status */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Data Status
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Equipment:</span>
                <span className="font-medium">{equipment.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Clients:</span>
                <span className="font-medium">{clients.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Bookings:</span>
                <span className="font-medium">{bookings.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <Bot className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>AI Business Assistant</CardTitle>
                <CardDescription>
                  Ask me anything about your business
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Online
            </Badge>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[500px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start space-x-3",
                    message.role === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : "",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      message.role === "user" ? "bg-orange-100" : "bg-gray-100",
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-orange-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "flex-1 max-w-md",
                      message.role === "user" ? "text-right" : "",
                    )}
                  >
                    <div
                      className={cn(
                        "p-3 rounded-lg",
                        message.role === "user"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-900",
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-gray-100">
                    <Bot className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-600">
                        AI is analyzing your data...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              onClick={toggleRecording}
              className={isRecording ? "animate-pulse" : ""}
            >
              {isRecording ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
            <Input
              placeholder="Ask me about revenue, clients, bookings, or equipment..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {isRecording && (
            <p className="text-sm text-gray-500 mt-2 text-center animate-pulse">
              🎤 Recording... Speak your question
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
