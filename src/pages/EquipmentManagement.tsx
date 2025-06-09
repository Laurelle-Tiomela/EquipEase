import { Layout } from "@/components/layout/Layout";
import { EquipmentManagement } from "@/components/business/EquipmentManagement";

const Equipment = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Equipment Management
          </h1>
          <p className="text-gray-600 mt-2">
            Add, edit, and manage your equipment fleet. Equipment added here
            will appear on the client website.
          </p>
        </div>

        <EquipmentManagement />
      </div>
    </Layout>
  );
};

export default Equipment;
