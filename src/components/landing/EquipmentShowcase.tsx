import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockEquipment } from "@/lib/mock-data";

export function EquipmentShowcase() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Heavy Construction Equipment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our extensive fleet of construction equipment available for
            rent. From excavators to cranes, we have the machinery you need for
            any project.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockEquipment.map((equipment) => (
            <Card
              key={equipment.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video relative">
                <img
                  src={equipment.imageUrl}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
                <Badge
                  className={`absolute top-4 right-4 ${
                    equipment.availability === "available"
                      ? "bg-green-500"
                      : equipment.availability === "rented"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                  }`}
                >
                  {equipment.availability}
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {equipment.name}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {equipment.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Weight:</span>
                      <div className="font-medium">
                        {equipment.specifications.weight}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Power:</span>
                      <div className="font-medium">
                        {equipment.specifications.power}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Capacity:</span>
                      <div className="font-medium">
                        {equipment.specifications.capacity}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Size:</span>
                      <div className="font-medium">
                        {equipment.specifications.dimensions}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-sm text-gray-500">Daily Rate</div>
                      <div className="text-2xl font-bold text-orange-600">
                        ${equipment.dailyRate}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Weekly</div>
                      <div className="font-semibold">
                        ${equipment.weeklyRate}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
