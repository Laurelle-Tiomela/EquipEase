import { useState, useEffect } from "react";
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
  Loader2,
  MessageCircle,
} from "lucide-react";
import { useEnhancedSupabase, useMessages } from "@/hooks/useEnhancedSupabase";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ChatInterface() {
  const { clients, clientsLoading } = useEnhancedSupabase();
  const { messages, sendMessage } = useMessages();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Auto-select first client if available
  useEffect(() => {
    if (clients.length > 0 && !selectedClient) {
      setSelectedClient(clients[0].id);
    }
  }, [clients, selectedClient]);

  const selectedClientData = clients.find(
    (client) => client.id === selectedClient,
  );

  // Filter messages for selected client
  const clientMessages = messages.filter(
    (message) =>
      message.sender_id === selectedClient ||
      message.receiver_id === selectedClient,
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedClient) return;

    setSending(true);
    try {
      await sendMessage(selectedClient, newMessage.trim());
      setNewMessage("");
      toast.success("Message sent");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (clientsLoading) {
    return (
      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] animate-pulse">
        <div className="bg-gray-200 rounded-lg"></div>
        <div className="lg:col-span-2 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Client List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Clients</span>
            <Badge variant="secondary">{clients.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {clients.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No clients available
              </div>
            ) : (
              clients.map((client) => (
                <div
                  key={client.id}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100",
                    selectedClient === client.id &&
                      "bg-orange-50 border-orange-200",
                  )}
                  onClick={() => setSelectedClient(client.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={client.avatar_url || undefined} />
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
                          client.is_online
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
                        {client.is_online
                          ? "Online"
                          : `Last seen ${formatTime(client.last_seen)}`}
                      </p>
                    </div>
                    {/* Unread message indicator */}
                    {clientMessages.some(
                      (m) => !m.is_read && m.sender_id === client.id,
                    ) && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="lg:col-span-2 flex flex-col">
        {selectedClient && selectedClientData ? (
          <>
            {/* Chat Header */}
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage
                      src={selectedClientData.avatar_url || undefined}
                    />
                    <AvatarFallback>
                      {selectedClientData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedClientData.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedClientData.company} •{" "}
                      {selectedClientData.profession}
                    </p>
                    <p className="text-xs text-gray-400">
                      {selectedClientData.total_bookings} bookings • $
                      {selectedClientData.total_spent.toLocaleString()} spent
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" title="Call Client">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" title="Video Call">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" title="More Options">
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
                  {clientMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No messages yet. Start a conversation!</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Say hello to {selectedClientData.name}
                      </p>
                    </div>
                  ) : (
                    clientMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.sender_id === "admin"
                            ? "justify-end"
                            : "justify-start",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                            message.sender_id === "admin"
                              ? "bg-orange-500 text-white"
                              : "bg-gray-100 text-gray-900",
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={cn(
                              "text-xs mt-1",
                              message.sender_id === "admin"
                                ? "text-orange-100"
                                : "text-gray-500",
                            )}
                          >
                            {formatTime(message.timestamp)}
                            {message.sender_id === "admin" && (
                              <span className="ml-2">
                                {message.is_read ? "✓✓" : "✓"}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" title="Attach File">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder={`Message ${selectedClientData.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSendMessage()
                  }
                  disabled={sending}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to Client Communication
              </h3>
              <p>Select a client to start chatting</p>
              <p className="text-sm text-gray-400 mt-2">
                Real-time messaging with your equipment rental clients
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
