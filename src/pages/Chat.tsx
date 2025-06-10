import { ChatInterface } from "@/components/chat/ChatInterface";

const Chat = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Client Communication
        </h1>
        <p className="text-gray-600 mt-2">
          Real-time chat with your clients. Send messages, share files, and
          coordinate projects instantly.
        </p>
      </div>

      <ChatInterface />
    </div>
  );
};

export default Chat;
