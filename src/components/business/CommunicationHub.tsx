import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Circle,
  Pin,
  Search,
  Camera,
  FileText,
  Image as ImageIcon,
  Mic,
  MicOff,
  VideoOff,
  ScanLine,
  Star,
  Archive,
  Trash2,
  MessageCircle,
  Clock,
} from "lucide-react";
import { useEnhancedClients, useMessages } from "@/hooks/useEnhancedSupabase";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CommunicationHubProps {
  className?: string;
}

export function CommunicationHub({ className }: CommunicationHubProps) {
  const { clients, loading: clientsLoading } = useEnhancedClients();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [pinnedContacts, setPinnedContacts] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    loading: messagesLoading,
    sendMessage,
  } = useMessages(selectedClient || undefined);

  const selectedClientData = clients.find(
    (client) => client.id === selectedClient,
  );

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedClient) return;

    try {
      await sendMessage({
        sender_id: "manager",
        receiver_id: selectedClient,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        type: "text",
        is_read: false,
      });

      setNewMessage("");
      toast.success("Message sent");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleFileUpload = (type: "image" | "file" | "document") => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleVoiceCall = () => {
    toast.info("Initiating voice call...");
    // Implement voice call functionality
  };

  const handleVideoCall = () => {
    setIsVideoCall(true);
    toast.info("Initiating video call...");
    // Implement video call functionality
  };

  const togglePinContact = (clientId: string) => {
    setPinnedContacts((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId],
    );
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    toast.info("Recording voice message...");
    // Implement voice recording
    setTimeout(() => {
      setIsRecording(false);
      toast.success("Voice message recorded");
    }, 3000);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLastMessagePreview = (clientId: string) => {
    const clientMessages = messages.filter(
      (m) =>
        (m.sender_id === clientId && m.receiver_id === "manager") ||
        (m.sender_id === "manager" && m.receiver_id === clientId),
    );
    const lastMessage = clientMessages[clientMessages.length - 1];
    if (!lastMessage) return "No messages yet";

    if (lastMessage.type === "voice") return "🎵 Voice message";
    if (lastMessage.type === "image") return "📷 Image";
    if (lastMessage.type === "file") return "📎 File";
    return lastMessage.content.length > 50
      ? lastMessage.content.substring(0, 50) + "..."
      : lastMessage.content;
  };

  const getUnreadCount = (clientId: string) => {
    return messages.filter(
      (m) =>
        m.sender_id === clientId && !m.is_read && m.receiver_id === "manager",
    ).length;
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
    <div
      className={cn(
        "grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]",
        className,
      )}
    >
      {/* Contacts Sidebar */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Clients</span>
            <Badge variant="secondary">{clients.length}</Badge>
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {/* Pinned Contacts */}
            {pinnedContacts.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  Pinned Contacts
                </h4>
                {clients
                  .filter((client) => pinnedContacts.includes(client.id))
                  .map((client) => (
                    <div
                      key={`pinned-${client.id}`}
                      className={cn(
                        "p-3 cursor-pointer hover:bg-gray-50 rounded-lg mb-2",
                        selectedClient === client.id &&
                          "bg-orange-50 border border-orange-200",
                      )}
                      onClick={() => setSelectedClient(client.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={client.avatar_url || undefined} />
                            <AvatarFallback className="text-xs">
                              {client.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <Pin className="absolute -top-1 -right-1 w-3 h-3 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {client.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {getLastMessagePreview(client.id)}
                          </p>
                        </div>
                        {getUnreadCount(client.id) > 0 && (
                          <Badge
                            variant="destructive"
                            className="text-xs px-1.5 py-0.5"
                          >
                            {getUnreadCount(client.id)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* All Contacts */}
            <div className="p-4">
              {filteredClients.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No clients found</p>
                </div>
              ) : (
                filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className={cn(
                      "p-3 cursor-pointer hover:bg-gray-50 rounded-lg mb-2 border",
                      selectedClient === client.id
                        ? "bg-orange-50 border-orange-200"
                        : "border-transparent",
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
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">
                            {client.name}
                          </p>
                          {client.reliability_score && (
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 mr-1" />
                              <span className="text-xs text-gray-500">
                                {client.reliability_score}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {client.company || client.profession}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {getLastMessagePreview(client.id)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {client.is_online
                            ? "Online"
                            : `Last seen ${formatTime(client.last_seen)}`}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {getUnreadCount(client.id) > 0 && (
                          <Badge
                            variant="destructive"
                            className="text-xs px-1.5 py-0.5"
                          >
                            {getUnreadCount(client.id)}
                          </Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePinContact(client.id);
                              }}
                            >
                              <Pin className="w-4 h-4 mr-2" />
                              {pinnedContacts.includes(client.id)
                                ? "Unpin"
                                : "Pin"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="w-4 h-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Chat
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
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
                      {selectedClientData.company ||
                        selectedClientData.profession}
                    </p>
                    <div className="flex items-center text-xs text-gray-400">
                      <Circle
                        className={cn(
                          "w-2 h-2 mr-1 rounded-full",
                          selectedClientData.is_online
                            ? "bg-green-500"
                            : "bg-gray-400",
                        )}
                      />
                      <span>
                        {selectedClientData.is_online
                          ? "Online"
                          : `Last seen ${formatTime(selectedClientData.last_seen)}`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={handleVoiceCall}>
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleVideoCall}>
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ScanLine className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <FileText className="w-4 h-4 mr-2" />
                        View Client Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="w-4 h-4 mr-2" />
                        Export Chat
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Star className="w-4 h-4 mr-2" />
                        Rate Client
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <Separator />

            {/* Messages */}
            <CardContent className="flex-1 p-0 relative">
              {isVideoCall && (
                <div className="absolute inset-0 z-50 bg-black rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Video className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg">
                      Video Call with {selectedClientData.name}
                    </p>
                    <p className="text-sm opacity-75">Call duration: 00:42</p>
                    <div className="flex items-center justify-center space-x-4 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/20 border-white/20 text-white"
                      >
                        <MicOff className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setIsVideoCall(false)}
                      >
                        <VideoOff className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <ScrollArea className="h-[400px] p-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>
                          Start a conversation with {selectedClientData.name}
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex items-end space-x-2",
                            message.sender_id === "manager"
                              ? "justify-end"
                              : "justify-start",
                          )}
                        >
                          {message.sender_id !== "manager" && (
                            <Avatar className="w-6 h-6">
                              <AvatarImage
                                src={selectedClientData.avatar_url || undefined}
                              />
                              <AvatarFallback className="text-xs">
                                {selectedClientData.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={cn(
                              "max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative",
                              message.sender_id === "manager"
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-900",
                            )}
                          >
                            {message.is_pinned && (
                              <Pin className="absolute -top-2 -right-2 w-3 h-3 text-orange-500" />
                            )}

                            {message.type === "voice" && (
                              <div className="flex items-center space-x-2">
                                <Mic className="w-4 h-4" />
                                <div className="flex-1 bg-white/20 rounded-full h-1">
                                  <div className="bg-white h-1 rounded-full w-1/3"></div>
                                </div>
                                <span className="text-xs">0:42</span>
                              </div>
                            )}

                            {message.type === "image" && (
                              <div>
                                <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-75" />
                                <p className="text-xs text-center">Image</p>
                              </div>
                            )}

                            {message.type === "file" && (
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">
                                  {message.file_name || "Document"}
                                </span>
                              </div>
                            )}

                            {message.type === "text" && (
                              <p className="text-sm">{message.content}</p>
                            )}

                            <div className="flex items-center justify-between mt-1">
                              <p
                                className={cn(
                                  "text-xs",
                                  message.sender_id === "manager"
                                    ? "text-orange-100"
                                    : "text-gray-500",
                                )}
                              >
                                {formatTime(message.timestamp)}
                              </p>
                              {message.sender_id === "manager" && (
                                <div className="text-xs">
                                  {message.is_read ? "✓✓" : "✓"}
                                </div>
                              )}
                            </div>
                          </div>
                          {message.sender_id === "manager" && (
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs bg-orange-500 text-white">
                                M
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleFileUpload("image")}>
                      <Camera className="w-4 h-4 mr-2" />
                      Photo
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFileUpload("file")}>
                      <FileText className="w-4 h-4 mr-2" />
                      Document
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleFileUpload("document")}
                    >
                      <ScanLine className="w-4 h-4 mr-2" />
                      Scan Document
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startVoiceRecording}
                  className={cn(isRecording && "bg-red-100 text-red-600")}
                >
                  {isRecording ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>

                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSendMessage()
                  }
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

              {isRecording && (
                <div className="flex items-center justify-center mt-2 text-red-600 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                  Recording voice message...
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  toast.success("File uploaded successfully");
                }
              }}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                Welcome to Communication Hub
              </h3>
              <p>Select a client to start chatting</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Voice calls
                </div>
                <div className="flex items-center">
                  <Video className="w-4 h-4 mr-2" />
                  Video calls
                </div>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  File sharing
                </div>
                <div className="flex items-center">
                  <ScanLine className="w-4 h-4 mr-2" />
                  Document scanning
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
