import { Layout } from "@/components/layout/Layout";
import { BookingManagement } from "@/components/business/BookingManagement";

const Booking = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Booking Management
          </h1>
          <p className="text-gray-600 mt-2">
            Review, approve, and manage equipment rental bookings from clients.
          </p>
        </div>

        <BookingManagement />
      </div>
    </Layout>
  );
};

export default Booking;
