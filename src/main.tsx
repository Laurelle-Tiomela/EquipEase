import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Suppress Recharts defaultProps warnings in development
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    // Filter out Recharts defaultProps warnings
    if (
      typeof args[0] === "string" &&
      args[0].includes("Support for defaultProps will be removed") &&
      (args[0].includes("XAxis") ||
        args[0].includes("YAxis") ||
        args[0].includes("CartesianGrid") ||
        args[0].includes("Tooltip") ||
        args[0].includes("Bar") ||
        args[0].includes("Line") ||
        args[0].includes("Pie") ||
        args[0].includes("Cell") ||
        args[0].includes("Area") ||
        args[0].includes("ResponsiveContainer"))
    ) {
      return; // Suppress Recharts defaultProps warnings
    }
    originalWarn.apply(console, args);
  };
}

createRoot(document.getElementById("root")!).render(<App />);
