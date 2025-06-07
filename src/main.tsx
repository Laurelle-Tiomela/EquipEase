import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Suppress Recharts defaultProps warnings in development
if (import.meta.env.DEV) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes(
        "Support for defaultProps will be removed from function components",
      ) &&
      (args[0].includes("XAxis") || args[0].includes("YAxis"))
    ) {
      return; // Suppress Recharts defaultProps warnings
    }
    originalWarn.apply(console, args);
  };
}

createRoot(document.getElementById("root")!).render(<App />);
