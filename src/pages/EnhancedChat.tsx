import { Layout } from "@/components/layout/Layout";
import { CommunicationHub } from "@/components/business/CommunicationHub";

const Chat = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Communication Hub
          </h1>
          <p className="text-gray-600 mt-2">
            Real-time messaging, voice calls, video calls, and file sharing with
            clients.
          </p>
        </div>

        <CommunicationHub />
      </div>
    </Layout>
  );
};

export default Chat;
