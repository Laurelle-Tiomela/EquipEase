import { DatabaseManager } from "@/components/database/DatabaseManager";

const Database = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Database Management
        </h1>
        <p className="text-gray-600 mt-2">
          View and manage your equipment, clients, bookings, and messages
          directly from the application.
        </p>
      </div>

      <DatabaseManager />
    </div>
  );
};

export default Database;
