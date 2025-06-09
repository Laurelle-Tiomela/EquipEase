import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Star, Search, Filter } from "lucide-react";
import { useEnhancedEquipment } from "@/hooks/useEnhancedSupabase";
import type { Equipment } from "@/lib/enhanced-types";
import { cn } from "@/lib/utils";

interface EquipmentCatalogProps {
  onBookNow?: (equipment: Equipment) => void;
  showFilters?: boolean;
}

export function EquipmentCatalog({
  onBookNow,
  showFilters = true,
}: EquipmentCatalogProps) {
  const { equipment, loading, getEquipmentAvailability } =
    useEnhancedEquipment();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedAvailability, setSelectedAvailability] =
    useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null,
  );

  const equipmentTypes = [
    "excavator",
    "crane",
    "bulldozer",
    "forklift",
    "compactor",
    "loader",
    "generator",
    "scaffolding",
  ];

  const filteredEquipment = equipment
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || item.type === selectedType;
      const matchesAvailability =
        selectedAvailability === "all" ||
        item.availability === selectedAvailability;

      return matchesSearch && matchesType && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.popularity_score - a.popularity_score;
        case "price_low":
          return a.daily_rate - b.daily_rate;
        case "price_high":
          return b.daily_rate - a.daily_rate;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const getAvailabilityBadge = (equipment: Equipment) => {
    switch (equipment.availability) {
      case "available":
        return <Badge className="bg-green-500">Available Now</Badge>;
      case "rented":
        return (
          <Badge className="bg-red-500">
            Rented - Available{" "}
            {equipment.available_date
              ? new Date(equipment.available_date).toLocaleDateString()
              : "TBD"}
          </Badge>
        );
      case "maintenance":
        return <Badge className="bg-yellow-500">Under Maintenance</Badge>;
      case "low_stock":
        return <Badge className="bg-orange-500">Low Stock</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filter Equipment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Equipment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {equipmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedAvailability}
                onValueChange={setSelectedAvailability}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-600 flex items-center">
                {filteredEquipment.length} equipment found
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipment Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden hover:shadow-lg transition-shadow group"
          >
            <div className="aspect-video relative">
              <img
                src={item.image_url || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                {getAvailabilityBadge(item)}
              </div>
              <div className="absolute top-4 left-4">
                <Badge
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{item.popularity_score}</span>
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <div className="font-medium capitalize">{item.type}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Weight:</span>
                    <div className="font-medium">
                      {item.specifications.weight}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Power:</span>
                    <div className="font-medium">
                      {item.specifications.power}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Capacity:</span>
                    <div className="font-medium">
                      {item.specifications.capacity}
                    </div>
                  </div>
                </div>

                {item.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{item.location.address}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-sm text-gray-500">Starting at</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(item.daily_rate)}/day
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-gray-500">
                      Weekly: {formatCurrency(item.weekly_rate)}
                    </div>
                    <div className="text-gray-500">
                      Monthly: {formatCurrency(item.monthly_rate)}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSelectedEquipment(item)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{selectedEquipment?.name}</DialogTitle>
                        <DialogDescription>
                          {selectedEquipment?.description}
                        </DialogDescription>
                      </DialogHeader>

                      {selectedEquipment && (
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <img
                              src={
                                selectedEquipment.image_url ||
                                "/placeholder.svg"
                              }
                              alt={selectedEquipment.name}
                              className="w-full h-64 object-cover rounded-lg"
                            />

                            {/* Additional gallery images */}
                            {selectedEquipment.gallery_images &&
                              selectedEquipment.gallery_images.length > 0 && (
                                <div className="grid grid-cols-4 gap-2 mt-4">
                                  {selectedEquipment.gallery_images.map(
                                    (image, index) => (
                                      <img
                                        key={index}
                                        src={image}
                                        alt={`${selectedEquipment.name} ${index + 1}`}
                                        className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-80"
                                      />
                                    ),
                                  )}
                                </div>
                              )}
                          </div>

                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold mb-2">
                                Specifications
                              </h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                {Object.entries(
                                  selectedEquipment.specifications,
                                ).map(([key, value]) => (
                                  <div key={key}>
                                    <span className="text-gray-500 capitalize">
                                      {key.replace("_", " ")}:
                                    </span>
                                    <div className="font-medium">{value}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Pricing</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Daily Rate:</span>
                                  <span className="font-bold">
                                    {formatCurrency(
                                      selectedEquipment.daily_rate,
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Weekly Rate:</span>
                                  <span className="font-bold">
                                    {formatCurrency(
                                      selectedEquipment.weekly_rate,
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Monthly Rate:</span>
                                  <span className="font-bold">
                                    {formatCurrency(
                                      selectedEquipment.monthly_rate,
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">
                                Availability
                              </h4>
                              {getAvailabilityBadge(selectedEquipment)}
                              {selectedEquipment.available_date && (
                                <p className="text-sm text-gray-600 mt-2">
                                  Next available:{" "}
                                  {new Date(
                                    selectedEquipment.available_date,
                                  ).toLocaleDateString()}
                                </p>
                              )}
                            </div>

                            {selectedEquipment.maintenance_schedule && (
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Maintenance Schedule
                                </h4>
                                <div className="text-sm space-y-1">
                                  <div className="flex justify-between">
                                    <span>Last Service:</span>
                                    <span>
                                      {new Date(
                                        selectedEquipment.maintenance_schedule.last_service,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Next Service:</span>
                                    <span>
                                      {new Date(
                                        selectedEquipment.maintenance_schedule.next_service,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            <Button
                              className="w-full bg-orange-500 hover:bg-orange-600"
                              disabled={
                                selectedEquipment.availability !== "available"
                              }
                              onClick={() => onBookNow?.(selectedEquipment)}
                            >
                              {selectedEquipment.availability === "available"
                                ? "Book Now"
                                : "Not Available"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    disabled={item.availability !== "available"}
                    onClick={() => onBookNow?.(item)}
                  >
                    {item.availability === "available"
                      ? "Book Now"
                      : "Not Available"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No equipment found</h3>
            <p>Try adjusting your search criteria or filters.</p>
          </div>
        </div>
      )}
    </div>
  );
}
