import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  MapPin,
  Navigation,
  RefreshCw,
  Truck,
  Clock,
  Battery,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useEnhancedSupabase } from "@/hooks/useEnhancedSupabase";

// Mock GPS data generator
const generateMockGPSData = (equipment: any[]) => {
  return equipment.map((eq) => {
    const baseLocations = [
      { lat: 40.7128, lng: -74.006, name: "Manhattan, NY" },
      { lat: 40.6782, lng: -73.9442, name: "Brooklyn, NY" },
      { lat: 40.7589, lng: -73.9851, name: "Queens, NY" },
      { lat: 40.8176, lng: -73.9782, name: "Bronx, NY" },
      { lat: 40.5795, lng: -74.1502, name: "Staten Island, NY" },
    ];

    const randomLocation =
      baseLocations[Math.floor(Math.random() * baseLocations.length)];
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;

    return {
      equipment_id: eq.id,
      equipment_name: eq.name,
      equipment_type: eq.type,
      image_url: eq.image_url,
      current_location: {
        lat: randomLocation.lat + latOffset,
        lng: randomLocation.lng + lngOffset,
        address: `${randomLocation.name} Construction Site`,
      },
      last_updated: new Date(
        Date.now() - Math.random() * 3600000,
      ).toISOString(),
      status:
        eq.availability === "rented"
          ? "active"
          : eq.availability === "maintenance"
            ? "maintenance"
            : Math.random() > 0.3
              ? "online"
              : "offline",
      battery_level: Math.floor(Math.random() * 100),
      speed: eq.availability === "rented" ? Math.floor(Math.random() * 25) : 0,
      heading: Math.floor(Math.random() * 360),
      geofence_alerts:
        Math.random() > 0.8
          ? [
              {
                type: "exit",
                location: "Construction Zone Alpha",
                timestamp: new Date(
                  Date.now() - Math.random() * 7200000,
                ).toISOString(),
              },
            ]
          : [],
    };
  });
};

// Simple map component using HTML5 canvas
const SimpleMap: React.FC<{
  gpsData: any[];
  selectedEquipment: string | null;
  onEquipmentSelect: (id: string) => void;
}> = ({ gpsData, selectedEquipment, onEquipmentSelect }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw NYC background
    ctx.fillStyle = "#f0f9ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // NYC bounds
    const nycBounds = {
      north: 40.9176,
      south: 40.4774,
      east: -73.7004,
      west: -74.2591,
    };

    // Convert lat/lng to canvas coordinates
    const latLngToPixel = (lat: number, lng: number) => {
      const x =
        ((lng - nycBounds.west) / (nycBounds.east - nycBounds.west)) *
        canvas.width;
      const y =
        ((nycBounds.north - lat) / (nycBounds.north - nycBounds.south)) *
        canvas.height;
      return { x, y };
    };

    // Draw equipment markers
    gpsData.forEach((equipment) => {
      const { x, y } = latLngToPixel(
        equipment.current_location.lat,
        equipment.current_location.lng,
      );

      // Marker color based on status
      let color = "#64748b"; // gray (offline)
      if (equipment.status === "online") color = "#22c55e"; // green
      if (equipment.status === "active") color = "#3b82f6"; // blue
      if (equipment.status === "maintenance") color = "#f59e0b"; // amber

      // Draw marker
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(
        x,
        y,
        selectedEquipment === equipment.equipment_id ? 12 : 8,
        0,
        2 * Math.PI,
      );
      ctx.fill();

      // Draw white center
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(
        x,
        y,
        selectedEquipment === equipment.equipment_id ? 6 : 4,
        0,
        2 * Math.PI,
      );
      ctx.fill();

      // Draw equipment type icon (simplified)
      ctx.fillStyle = color;
      ctx.font =
        selectedEquipment === equipment.equipment_id
          ? "14px Arial"
          : "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(equipment.equipment_type[0].toUpperCase(), x, y + 3);
    });

    // Draw legend
    ctx.fillStyle = "white";
    ctx.fillRect(10, 10, 200, 120);
    ctx.strokeStyle = "#e2e8f0";
    ctx.strokeRect(10, 10, 200, 120);

    ctx.fillStyle = "#1f2937";
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Equipment Status", 20, 30);

    const legendItems = [
      { color: "#22c55e", label: "Online" },
      { color: "#3b82f6", label: "Active (Rented)" },
      { color: "#f59e0b", label: "Maintenance" },
      { color: "#64748b", label: "Offline" },
    ];

    legendItems.forEach((item, index) => {
      const y = 50 + index * 20;
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(30, y - 5, 5, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = "#374151";
      ctx.font = "12px Arial";
      ctx.fillText(item.label, 45, y);
    });
  }, [gpsData, selectedEquipment]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // NYC bounds
    const nycBounds = {
      north: 40.9176,
      south: 40.4774,
      east: -73.7004,
      west: -74.2591,
    };

    // Convert lat/lng to canvas coordinates
    const latLngToPixel = (lat: number, lng: number) => {
      const pixelX =
        ((lng - nycBounds.west) / (nycBounds.east - nycBounds.west)) *
        canvas.width;
      const pixelY =
        ((nycBounds.north - lat) / (nycBounds.north - nycBounds.south)) *
        canvas.height;
      return { x: pixelX, y: pixelY };
    };

    // Check if click is near any equipment
    for (const equipment of gpsData) {
      const { x: equipX, y: equipY } = latLngToPixel(
        equipment.current_location.lat,
        equipment.current_location.lng,
      );

      const distance = Math.sqrt((x - equipX) ** 2 + (y - equipY) ** 2);
      if (distance <= 15) {
        onEquipmentSelect(equipment.equipment_id);
        break;
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="w-full h-full border rounded-lg cursor-pointer"
      onClick={handleCanvasClick}
      style={{ maxHeight: "400px" }}
    />
  );
};

export const GPSTracking: React.FC = () => {
  const { equipment } = useEnhancedSupabase();
  const [gpsData, setGpsData] = useState<any[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    null,
  );
  const [refreshing, setRefreshing] = useState(false);

  // Generate mock GPS data
  useEffect(() => {
    if (equipment.length > 0) {
      setGpsData(generateMockGPSData(equipment));
    }
  }, [equipment]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setGpsData(generateMockGPSData(equipment));
    setRefreshing(false);
  };

  const selectedEquipmentData = gpsData.find(
    (data) => data.equipment_id === selectedEquipment,
  );

  const formatLastUpdated = (timestamp: string) => {
    const now = new Date();
    const updated = new Date(timestamp);
    const diffMinutes = Math.floor(
      (now.getTime() - updated.getTime()) / (1000 * 60),
    );

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return updated.toLocaleDateString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-green-500" />;
      case "active":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "maintenance":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "active":
        return "bg-blue-500";
      case "maintenance":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const onlineCount = gpsData.filter((d) => d.status === "online").length;
  const activeCount = gpsData.filter((d) => d.status === "active").length;
  const offlineCount = gpsData.filter((d) => d.status === "offline").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GPS Tracking</h1>
          <p className="text-gray-600">
            Real-time location and status monitoring for your equipment fleet
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600">Online</p>
                <p className="text-2xl font-bold">{onlineCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold">
                  {gpsData.filter((d) => d.status === "maintenance").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600">Offline</p>
                <p className="text-2xl font-bold">{offlineCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Equipment Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Interactive Map:</strong> Click on equipment markers to
                view details. This is a simplified map view - in production,
                this would integrate with Google Maps or similar mapping
                service.
              </p>
            </div>
            <SimpleMap
              gpsData={gpsData}
              selectedEquipment={selectedEquipment}
              onEquipmentSelect={setSelectedEquipment}
            />
          </CardContent>
        </Card>

        {/* Equipment List */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment Status</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {gpsData.map((equipment) => (
                <div
                  key={equipment.equipment_id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedEquipment === equipment.equipment_id
                      ? "bg-blue-50 border-blue-200"
                      : ""
                  }`}
                  onClick={() => setSelectedEquipment(equipment.equipment_id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={equipment.image_url}
                        alt={equipment.equipment_name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {equipment.equipment_name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {equipment.equipment_type}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatLastUpdated(equipment.last_updated)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        {getStatusIcon(equipment.status)}
                        <Badge
                          variant="outline"
                          className={`text-white ${getStatusColor(equipment.status)}`}
                        >
                          {equipment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Battery className="h-3 w-3" />
                        {equipment.battery_level}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Equipment Details */}
      {selectedEquipmentData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              {selectedEquipmentData.equipment_name} Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Location Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Address:</span>
                    <span className="text-right">
                      {selectedEquipmentData.current_location.address}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coordinates:</span>
                    <span className="text-right">
                      {selectedEquipmentData.current_location.lat.toFixed(4)},{" "}
                      {selectedEquipmentData.current_location.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="text-right">
                      {formatLastUpdated(selectedEquipmentData.last_updated)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Status & Performance</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge
                      className={getStatusColor(selectedEquipmentData.status)}
                    >
                      {selectedEquipmentData.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span>{selectedEquipmentData.speed} mph</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heading:</span>
                    <span>{selectedEquipmentData.heading}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Battery:</span>
                    <span>{selectedEquipmentData.battery_level}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Alerts & Notifications</h3>
                <div className="space-y-2">
                  {selectedEquipmentData.geofence_alerts.length > 0 ? (
                    selectedEquipmentData.geofence_alerts.map(
                      (alert: any, index: number) => (
                        <div
                          key={index}
                          className="p-2 bg-amber-50 border border-amber-200 rounded text-sm"
                        >
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-amber-500" />
                            <span className="font-medium">
                              Geofence {alert.type}
                            </span>
                          </div>
                          <p className="text-xs text-amber-700 mt-1">
                            {alert.location} -{" "}
                            {formatLastUpdated(alert.timestamp)}
                          </p>
                        </div>
                      ),
                    )
                  ) : (
                    <p className="text-sm text-gray-500">No recent alerts</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
