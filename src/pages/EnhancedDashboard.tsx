import { Layout } from "@/components/layout/Layout";
import { EnhancedDashboard } from "@/components/business/EnhancedDashboard";

const Dashboard = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EnhancedDashboard />
      </div>
    </Layout>
  );
};

export default Dashboard;
