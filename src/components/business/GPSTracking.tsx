import { useState, useEffect } from "react";
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
import {
  Navigation,
  MapPin,
  Truck,
  RefreshCw,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Route,
  Zap,
} from "lucide-react";
import { useEnhancedEquipment } from "@/hooks/useEnhancedSupabase";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GPSLocation {
  lat: number;
  lng: number;
  address: string;
  lastUpdated: string;
  speed?: number;
  heading?: number;
  accuracy?: number;
}

export function GPSTracking() {
  const { equipment, loading, updateEquipmentLocation } =
    useEnhancedEquipment();
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gpsData, setGpsData] = useState<Record<string, GPSLocation>>({});
  const [isTracking, setIsTracking] = useState(false);
  const [mapView, setMapView] = useState<"list" | "map">("list");

  // Mock GPS data for demonstration
  useEffect(() => {
    const mockGPSData: Record<string, GPSLocation> = {};
    equipment.forEach((item, index) => {
      const baseCoords = [
        { lat: 40.7128, lng: -74.006, address: "New York, NY" },
        { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
        { lat: 41.8781, lng: -87.6298, address: "Chicago, IL" },
        { lat: 29.7604, lng: -95.3698, address: "Houston, TX" },
        { lat: 33.4484, lng: -112.074, address: "Phoenix, AZ" },
      ];

      const location = baseCoords[index % baseCoords.length];
      mockGPSData[item.id] = {
        lat: location.lat + (Math.random() - 0.5) * 0.1,
        lng: location.lng + (Math.random() - 0.5) * 0.1,
        address: `${Math.floor(Math.random() * 9999) + 1000} Construction Site, ${location.address}`,
        lastUpdated: new Date(
          Date.now() - Math.random() * 3600000,
        ).toISOString(),
        speed: Math.floor(Math.random() * 60),
        heading: Math.floor(Math.random() * 360),
        accuracy: Math.floor(Math.random() * 10) + 1,
      };
    });
    setGpsData(mockGPSData);
  }, [equipment]);

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gpsData[item.id]?.address
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.availability === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateLocation = async (equipmentId: string) => {
    try {
      // Simulate getting current location
      const location = gpsData[equipmentId];
      if (location) {
        await updateEquipmentLocation(equipmentId, {
          lat: location.lat,
          lng: location.lng,
          address: location.address,
        });
        toast.success("Location updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update location");
    }
  };

  const getLocationStatus = (equipmentId: string) => {
    const location = gpsData[equipmentId];
    if (!location) return { status: "offline", color: "bg-gray-500" };

    const lastUpdate = new Date(location.lastUpdated);
    const now = new Date();
    const timeDiff = now.getTime() - lastUpdate.getTime();
    const minutesAgo = Math.floor(timeDiff / (1000 * 60));

    if (minutesAgo < 5) {
      return { status: "online", color: "bg-green-500" };
    } else if (minutesAgo < 30) {
      return { status: "recent", color: "bg-yellow-500" };
    } else {
      return { status: "stale", color: "bg-red-500" };
    }
  };

  const formatLastUpdate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const simulateLocationUpdate = () => {
    setIsTracking(true);
    toast.info("Starting GPS tracking simulation...");

    // Simulate real-time updates for 10 seconds
    const interval = setInterval(() => {
      setGpsData((prev) => {
        const newData = { ...prev };
        Object.keys(newData).forEach((equipmentId) => {
          if (Math.random() > 0.3) {
            // 70% chance to update each equipment
            newData[equipmentId] = {
              ...newData[equipmentId],
              lat: newData[equipmentId].lat + (Math.random() - 0.5) * 0.001,
              lng: newData[equipmentId].lng + (Math.random() - 0.5) * 0.001,
              lastUpdated: new Date().toISOString(),
              speed: Math.floor(Math.random() * 60),
              heading: Math.floor(Math.random() * 360),
            };
          }
        });
        return newData;
      });
    }, 2000);

    setTimeout(() => {
      clearInterval(interval);
      setIsTracking(false);
      toast.success("GPS tracking simulation completed");
    }, 10000);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-96 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">GPS Tracking</h2>
          <p className="text-gray-600">
            Real-time location tracking for your equipment fleet
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={simulateLocationUpdate}
            disabled={isTracking}
          >
            {isTracking ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {isTracking ? "Tracking..." : "Simulate Live Tracking"}
          </Button>
          <Button
            variant={mapView === "map" ? "default" : "outline"}
            onClick={() => setMapView(mapView === "map" ? "list" : "map")}
          >
            <Navigation className="w-4 h-4 mr-2" />
            {mapView === "map" ? "List View" : "Map View"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search equipment or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Equipment</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Currently Rented</SelectItem>
                <SelectItem value="maintenance">In Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* GPS Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="text-sm text-gray-600">Online</div>
                <div className="text-xl font-bold">
                  {
                    Object.keys(gpsData).filter(
                      (id) => getLocationStatus(id).status === "online",
                    ).length
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <div className="text-sm text-gray-600">Recent</div>
                <div className="text-xl font-bold">
                  {
                    Object.keys(gpsData).filter(
                      (id) => getLocationStatus(id).status === "recent",
                    ).length
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <div className="text-sm text-gray-600">Offline</div>
                <div className="text-xl font-bold">
                  {
                    Object.keys(gpsData).filter(
                      (id) =>
                        getLocationStatus(id).status === "stale" ||
                        getLocationStatus(id).status === "offline",
                    ).length
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Total Fleet</div>
                <div className="text-xl font-bold">{equipment.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment List with GPS Data */}
      {mapView === "list" ? (
        <Card>
          <CardHeader>
            <CardTitle>Equipment Locations</CardTitle>
            <CardDescription>
              Current GPS positions and status of your equipment fleet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEquipment.map((item) => {
                const location = gpsData[item.id];
                const status = getLocationStatus(item.id);

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div
                          className={cn(
                            "absolute -top-1 -right-1 w-4 h-4 border-2 border-white rounded-full",
                            status.color,
                          )}
                        ></div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">{item.type}</p>

                        {location && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="truncate">
                                {location.address}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>
                                📍 {location.lat.toFixed(4)},{" "}
                                {location.lng.toFixed(4)}
                              </span>
                              <span>
                                🕒 {formatLastUpdate(location.lastUpdated)}
                              </span>
                              {location.speed !== undefined && (
                                <span>🚗 {location.speed} mph</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={status.color}>
                        {status.status.toUpperCase()}
                      </Badge>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEquipment(item.id)}
                          >
                            <Navigation className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>GPS Details - {item.name}</DialogTitle>
                            <DialogDescription>
                              Detailed location and tracking information
                            </DialogDescription>
                          </DialogHeader>

                          {location && (
                            <div className="space-y-6">
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold mb-3">
                                    Location Information
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <strong>Address:</strong>{" "}
                                      {location.address}
                                    </div>
                                    <div>
                                      <strong>Coordinates:</strong>{" "}
                                      {location.lat.toFixed(6)},{" "}
                                      {location.lng.toFixed(6)}
                                    </div>
                                    <div>
                                      <strong>Last Update:</strong>{" "}
                                      {new Date(
                                        location.lastUpdated,
                                      ).toLocaleString()}
                                    </div>
                                    <div>
                                      <strong>Status:</strong>{" "}
                                      <Badge className={status.color}>
                                        {status.status.toUpperCase()}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-3">
                                    Tracking Data
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <strong>Speed:</strong>{" "}
                                      {location.speed || 0} mph
                                    </div>
                                    <div>
                                      <strong>Heading:</strong>{" "}
                                      {location.heading || 0}°
                                    </div>
                                    <div>
                                      <strong>Accuracy:</strong>{" "}
                                      {location.accuracy || "N/A"}m
                                    </div>
                                    <div>
                                      <strong>Equipment Status:</strong>{" "}
                                      <Badge
                                        variant={
                                          item.availability === "available"
                                            ? "default"
                                            : "secondary"
                                        }
                                      >
                                        {item.availability}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Mock Map Placeholder */}
                              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                                <div className="text-center">
                                  <Navigation className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                  <h3 className="text-lg font-medium text-gray-600">
                                    Interactive Map
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    Google Maps integration will show equipment
                                    location
                                  </p>
                                  <p className="text-xs text-gray-400 mt-2">
                                    📍 {location.lat.toFixed(4)},{" "}
                                    {location.lng.toFixed(4)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex space-x-4">
                                <Button
                                  onClick={() => updateLocation(item.id)}
                                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                                >
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Update Location
                                </Button>
                                <Button variant="outline" className="flex-1">
                                  <Route className="w-4 h-4 mr-2" />
                                  View Route History
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateLocation(item.id)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredEquipment.length === 0 && (
              <div className="text-center py-8">
                <Navigation className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">
                  No equipment found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Map View */
        <Card>
          <CardHeader>
            <CardTitle>Equipment Map View</CardTitle>
            <CardDescription>
              Interactive map showing all equipment locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Navigation className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium text-gray-600">
                  Interactive Map View
                </h3>
                <p className="text-gray-500 mb-4">
                  Google Maps integration will display all equipment locations
                  with real-time tracking
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    Online (
                    {
                      Object.keys(gpsData).filter(
                        (id) => getLocationStatus(id).status === "online",
                      ).length
                    }
                    )
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    Recent (
                    {
                      Object.keys(gpsData).filter(
                        (id) => getLocationStatus(id).status === "recent",
                      ).length
                    }
                    )
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    Offline (
                    {
                      Object.keys(gpsData).filter(
                        (id) =>
                          getLocationStatus(id).status === "stale" ||
                          getLocationStatus(id).status === "offline",
                      ).length
                    }
                    )
                  </div>
                  <div className="flex items-center">
                    <Truck className="w-3 h-3 text-gray-400 mr-2" />
                    Total ({equipment.length})
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
