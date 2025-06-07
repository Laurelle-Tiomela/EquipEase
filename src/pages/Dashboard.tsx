import { Layout } from "@/components/layout/Layout";
import { Analytics } from "@/components/dashboard/Analytics";

const Dashboard = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Business Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Real-time insights into your equipment rental business performance.
          </p>
        </div>

        <Analytics />
      </div>
    </Layout>
  );
};

export default Dashboard;
