import { Layout } from "@/components/layout/Layout";
import { GPSTracking } from "@/components/business/GPSTracking";

const GPS = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">GPS Tracking</h1>
          <p className="text-gray-600 mt-2">
            Monitor real-time locations of your equipment fleet with GPS
            tracking and route history.
          </p>
        </div>

        <GPSTracking />
      </div>
    </Layout>
  );
};

export default GPS;
