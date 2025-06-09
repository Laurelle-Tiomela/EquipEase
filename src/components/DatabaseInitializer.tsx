import { useEffect, useState } from "react";
import { initializeSampleData } from "@/lib/enhanced-sample-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function DatabaseInitializer() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleInitialize = async () => {
    setStatus("loading");
    setMessage("Initializing database with comprehensive sample data...");

    try {
      const success = await initializeSampleData();
      if (success) {
        setStatus("success");
        setMessage(
          "Database initialized successfully with 6 equipment items, 8 clients, 13+ bookings, chat messages, and comprehensive analytics data!",
        );
      } else {
        setStatus("error");
        setMessage("Failed to initialize database. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Database Setup</span>
        </CardTitle>
        <CardDescription>
          Initialize your system with comprehensive sample data including
          equipment, clients, bookings, and chat messages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            Before you start:
          </h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Make sure you've created the database tables in Supabase</li>
            <li>
              Copy the SQL from the console log and run it in Supabase SQL
              editor
            </li>
            <li>Click the button below to populate with sample data</li>
          </ol>
        </div>

        {status !== "idle" && (
          <div
            className={`p-4 rounded-lg flex items-center space-x-2 ${
              status === "loading"
                ? "bg-blue-50 text-blue-800"
                : status === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
            }`}
          >
            {status === "loading" && (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}
            {status === "success" && <CheckCircle className="w-5 h-5" />}
            {status === "error" && <AlertCircle className="w-5 h-5" />}
            <span>{message}</span>
          </div>
        )}

        <Button
          onClick={handleInitialize}
          disabled={status === "loading"}
          className="w-full"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Initializing...
            </>
          ) : (
            "Initialize Database with Sample Data"
          )}
        </Button>

        <div className="text-xs text-gray-500 mt-4">
          <p>
            <strong>Note:</strong> This will add sample equipment and clients to
            your database. Only run this once when setting up your application.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
