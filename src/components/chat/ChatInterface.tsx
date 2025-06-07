import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Circle,
} from "lucide-react";
import { mockClients, mockMessages } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ChatInterface() {
  const [selectedClient, setSelectedClient] = useState(mockClients[0]);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: String(messages.length + 1),
      senderId: "manager",
      receiverId: selectedClient.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "text" as const,
      isRead: false,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Client List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Clients</span>
            <Badge variant="secondary">{mockClients.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {mockClients.map((client) => (
              <div
                key={client.id}
                className={cn(
                  "p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100",
                  selectedClient.id === client.id &&
                    "bg-orange-50 border-orange-200",
                )}
                onClick={() => setSelectedClient(client)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback>
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Circle
                      className={cn(
                        "absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full",
                        client.isOnline
                          ? "fill-green-500 text-green-500"
                          : "fill-gray-400 text-gray-400",
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {client.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {client.company}
                    </p>
                    <p className="text-xs text-gray-400">
                      {client.isOnline
                        ? "Online"
                        : `Last seen ${formatTime(client.lastSeen)}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="lg:col-span-2 flex flex-col">
        {/* Chat Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={selectedClient.avatar} />
                <AvatarFallback>
                  {selectedClient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedClient.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedClient.company}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <Separator />

        {/* Messages */}
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[400px] p-4">
            <div className="space-y-4">
              {messages
                .filter(
                  (m) =>
                    (m.senderId === selectedClient.id &&
                      m.receiverId === "manager") ||
                    (m.senderId === "manager" &&
                      m.receiverId === selectedClient.id),
                )
                .map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.senderId === "manager"
                        ? "justify-end"
                        : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                        message.senderId === "manager"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-900",
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          message.senderId === "manager"
                            ? "text-orange-100"
                            : "text-gray-500",
                        )}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
