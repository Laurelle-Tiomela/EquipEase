import { Layout } from "@/components/layout/Layout";
import { BookingForm } from "@/components/booking/BookingForm";

const Booking = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Equipment Booking
          </h1>
          <p className="text-gray-600 mt-2">
            Select equipment and schedule your rental. Our team will contact you
            to confirm details.
          </p>
        </div>

        <BookingForm />
      </div>
    </Layout>
  );
};

export default Booking;
