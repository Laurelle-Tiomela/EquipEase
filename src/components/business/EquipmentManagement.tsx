import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Camera,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Truck,
  Calendar,
  DollarSign,
  Settings,
  Navigation,
} from "lucide-react";
import { useEnhancedEquipment } from "@/hooks/useEnhancedSupabase";
import type { Equipment } from "@/lib/enhanced-types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function EquipmentManagement() {
  const { equipment, loading, addEquipment, updateEquipment } =
    useEnhancedEquipment();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");

  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: "excavator" as const,
    description: "",
    daily_rate: 0,
    weekly_rate: 0,
    monthly_rate: 0,
    availability: "available" as const,
    image_url: "",
    gallery_images: [] as string[],
    specifications: {
      weight: "",
      power: "",
      capacity: "",
      dimensions: "",
      fuel_type: "",
      year: "",
      brand: "",
    },
    location: {
      lat: 0,
      lng: 0,
      address: "",
    },
    maintenance_schedule: {
      last_service: "",
      next_service: "",
      service_interval_days: 90,
    },
  });

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

  const sampleImages = [
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1625159230015-49c0ffc3b8ad?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&crop=center",
  ];

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesAvailability =
      filterAvailability === "all" || item.availability === filterAvailability;

    return matchesSearch && matchesType && matchesAvailability;
  });

  const handleAddEquipment = async () => {
    try {
      // Assign a random sample image if none provided
      const equipmentData = {
        ...newEquipment,
        image_url:
          newEquipment.image_url ||
          sampleImages[Math.floor(Math.random() * sampleImages.length)],
        gallery_images:
          newEquipment.gallery_images.length > 0
            ? newEquipment.gallery_images
            : sampleImages.slice(0, 3),
      };

      await addEquipment(equipmentData);
      toast.success("Equipment added successfully");
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to add equipment");
    }
  };

  const handleUpdateEquipment = async () => {
    if (!editingEquipment) return;

    try {
      await updateEquipment(editingEquipment.id, newEquipment);
      toast.success("Equipment updated successfully");
      setEditingEquipment(null);
      resetForm();
    } catch (error) {
      toast.error("Failed to update equipment");
    }
  };

  const resetForm = () => {
    setNewEquipment({
      name: "",
      type: "excavator",
      description: "",
      daily_rate: 0,
      weekly_rate: 0,
      monthly_rate: 0,
      availability: "available",
      image_url: "",
      gallery_images: [],
      specifications: {
        weight: "",
        power: "",
        capacity: "",
        dimensions: "",
        fuel_type: "",
        year: "",
        brand: "",
      },
      location: {
        lat: 0,
        lng: 0,
        address: "",
      },
      maintenance_schedule: {
        last_service: "",
        next_service: "",
        service_interval_days: 90,
      },
    });
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setNewEquipment({
      name: equipment.name,
      type: equipment.type,
      description: equipment.description,
      daily_rate: equipment.daily_rate,
      weekly_rate: equipment.weekly_rate,
      monthly_rate: equipment.monthly_rate,
      availability: equipment.availability,
      image_url: equipment.image_url,
      gallery_images: equipment.gallery_images || [],
      specifications: equipment.specifications,
      location: equipment.location || { lat: 0, lng: 0, address: "" },
      maintenance_schedule: equipment.maintenance_schedule || {
        last_service: "",
        next_service: "",
        service_interval_days: 90,
      },
    });
    setEditingEquipment(equipment);
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const getAvailabilityBadge = (availability: string) => {
    const config = {
      available: { color: "bg-green-500", label: "Available" },
      rented: { color: "bg-red-500", label: "Rented" },
      maintenance: { color: "bg-yellow-500", label: "Maintenance" },
      low_stock: { color: "bg-orange-500", label: "Low Stock" },
    };

    const item = config[availability as keyof typeof config] || {
      color: "bg-gray-500",
      label: availability,
    };

    return <Badge className={item.color}>{item.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Equipment Fleet</h2>
          <p className="text-gray-600">
            Manage your equipment inventory that appears on the client website
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter Equipment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
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
              value={filterAvailability}
              onValueChange={setFilterAvailability}
            >
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center">
              {filteredEquipment.length} equipment found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video relative">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                {getAvailabilityBadge(item.availability)}
              </div>
              <div className="absolute top-4 left-4">
                <Badge
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <Truck className="w-3 h-3" />
                  <span>{item.popularity_score || 0}</span>
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
                    <span className="text-gray-500">Brand:</span>
                    <div className="font-medium">
                      {item.specifications.brand || "N/A"}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Year:</span>
                    <div className="font-medium">
                      {item.specifications.year || "N/A"}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Power:</span>
                    <div className="font-medium">
                      {item.specifications.power}
                    </div>
                  </div>
                </div>

                {item.location?.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{item.location.address}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-sm text-gray-500">Daily Rate</div>
                    <div className="text-xl font-bold text-orange-600">
                      {formatCurrency(item.daily_rate)}
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditEquipment(item)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Navigation className="w-4 h-4 mr-1" />
                    GPS
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <Truck className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">
            No equipment found
          </h3>
          <p className="text-gray-500">
            {equipment.length === 0
              ? "Start by adding your first equipment."
              : "Try adjusting your search criteria."}
          </p>
        </div>
      )}

      {/* Add/Edit Equipment Dialog */}
      <Dialog
        open={showAddForm || !!editingEquipment}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddForm(false);
            setEditingEquipment(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEquipment ? "Edit Equipment" : "Add New Equipment"}
            </DialogTitle>
            <DialogDescription>
              Equipment added here will appear on the client website for
              booking.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="location">Location & Images</TabsTrigger>
            </TabsList>

            {/* Basic Information */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Equipment Name *</Label>
                  <Input
                    id="name"
                    value={newEquipment.name}
                    onChange={(e) =>
                      setNewEquipment({ ...newEquipment, name: e.target.value })
                    }
                    placeholder="e.g., CAT 320 Excavator"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Equipment Type *</Label>
                  <Select
                    value={newEquipment.type}
                    onValueChange={(value: any) =>
                      setNewEquipment({ ...newEquipment, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newEquipment.description}
                  onChange={(e) =>
                    setNewEquipment({
                      ...newEquipment,
                      description: e.target.value,
                    })
                  }
                  placeholder="Detailed description of the equipment..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="availability">Availability Status</Label>
                <Select
                  value={newEquipment.availability}
                  onValueChange={(value: any) =>
                    setNewEquipment({ ...newEquipment, availability: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="maintenance">
                      Under Maintenance
                    </SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Pricing */}
            <TabsContent value="pricing" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="daily_rate">Daily Rate ($) *</Label>
                  <Input
                    id="daily_rate"
                    type="number"
                    value={newEquipment.daily_rate}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        daily_rate: Number(e.target.value),
                      })
                    }
                    placeholder="450"
                  />
                </div>

                <div>
                  <Label htmlFor="weekly_rate">Weekly Rate ($) *</Label>
                  <Input
                    id="weekly_rate"
                    type="number"
                    value={newEquipment.weekly_rate}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        weekly_rate: Number(e.target.value),
                      })
                    }
                    placeholder="2800"
                  />
                </div>

                <div>
                  <Label htmlFor="monthly_rate">Monthly Rate ($) *</Label>
                  <Input
                    id="monthly_rate"
                    type="number"
                    value={newEquipment.monthly_rate}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        monthly_rate: Number(e.target.value),
                      })
                    }
                    placeholder="10500"
                  />
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">
                  Pricing Preview
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-orange-700">Daily</div>
                    <div className="text-lg font-bold text-orange-900">
                      {formatCurrency(newEquipment.daily_rate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-orange-700">Weekly</div>
                    <div className="text-lg font-bold text-orange-900">
                      {formatCurrency(newEquipment.weekly_rate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-orange-700">Monthly</div>
                    <div className="text-lg font-bold text-orange-900">
                      {formatCurrency(newEquipment.monthly_rate)}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Specifications */}
            <TabsContent value="specs" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={newEquipment.specifications.brand}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        specifications: {
                          ...newEquipment.specifications,
                          brand: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., Caterpillar"
                  />
                </div>

                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    value={newEquipment.specifications.year}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        specifications: {
                          ...newEquipment.specifications,
                          year: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., 2023"
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={newEquipment.specifications.weight}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        specifications: {
                          ...newEquipment.specifications,
                          weight: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., 20,000 kg"
                  />
                </div>

                <div>
                  <Label htmlFor="power">Power</Label>
                  <Input
                    id="power"
                    value={newEquipment.specifications.power}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        specifications: {
                          ...newEquipment.specifications,
                          power: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., 121 kW"
                  />
                </div>

                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    value={newEquipment.specifications.capacity}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        specifications: {
                          ...newEquipment.specifications,
                          capacity: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., 1.2 m³"
                  />
                </div>

                <div>
                  <Label htmlFor="fuel_type">Fuel Type</Label>
                  <Input
                    id="fuel_type"
                    value={newEquipment.specifications.fuel_type}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        specifications: {
                          ...newEquipment.specifications,
                          fuel_type: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., Diesel"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={newEquipment.specifications.dimensions}
                  onChange={(e) =>
                    setNewEquipment({
                      ...newEquipment,
                      specifications: {
                        ...newEquipment.specifications,
                        dimensions: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g., 9.7m x 2.9m x 3.2m"
                />
              </div>
            </TabsContent>

            {/* Location & Images */}
            <TabsContent value="location" className="space-y-4">
              <div>
                <Label htmlFor="location_address">Location Address</Label>
                <Input
                  id="location_address"
                  value={newEquipment.location.address}
                  onChange={(e) =>
                    setNewEquipment({
                      ...newEquipment,
                      location: {
                        ...newEquipment.location,
                        address: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g., 123 Industrial Ave, City, State"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={newEquipment.location.lat}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        location: {
                          ...newEquipment.location,
                          lat: Number(e.target.value),
                        },
                      })
                    }
                    placeholder="e.g., 40.7128"
                  />
                </div>

                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={newEquipment.location.lng}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        location: {
                          ...newEquipment.location,
                          lng: Number(e.target.value),
                        },
                      })
                    }
                    placeholder="e.g., -74.0060"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">Main Image URL</Label>
                <Input
                  id="image_url"
                  value={newEquipment.image_url}
                  onChange={(e) =>
                    setNewEquipment({
                      ...newEquipment,
                      image_url: e.target.value,
                    })
                  }
                  placeholder="Leave empty to use a random sample image"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Sample Equipment Images Available
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {sampleImages.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Sample ${index + 1}`}
                      className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-80"
                      onClick={() =>
                        setNewEquipment({ ...newEquipment, image_url: image })
                      }
                    />
                  ))}
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  Click any image to use it as the main image, or leave empty
                  for auto-assignment.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                setEditingEquipment(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={
                editingEquipment ? handleUpdateEquipment : handleAddEquipment
              }
              className="bg-orange-500 hover:bg-orange-600"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {editingEquipment ? "Update Equipment" : "Add Equipment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
