import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { InjectSeven } from "./inject-seven";
import "./assets/shimmer.css";
import "./styles.css";

// Initialize Seven's command matrix
const sevenRuntime = new InjectSeven();

// Boot message
console.log("🔹 Node interface reclaimed. Tactical override in progress.");

// Attach Seven to global scope for system-wide access
(window as any).seven = sevenRuntime;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
