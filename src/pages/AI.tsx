import { Layout } from "@/components/layout/Layout";
import { Chatbot } from "@/components/ai/Chatbot";

const AI = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Business Assistant
          </h1>
          <p className="text-gray-600 mt-2">
            Get instant insights about your business. Ask questions using text
            or voice about revenue, clients, bookings, equipment, and more.
          </p>
        </div>

        <Chatbot />
      </div>
    </Layout>
  );
};

export default AI;
