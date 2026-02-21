"use client";

import { useState, useCallback } from "react";
import Dashboard from "@/components/Dashboard";
import Scanner from "@/components/Scanner";
import ThreatLog from "@/components/ThreatLog";
import Settings from "@/components/Settings";
import Sidebar from "@/components/Sidebar";

export type View = "dashboard" | "scanner" | "threats" | "settings";

export default function Home() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [scanCount, setScanCount] = useState(0);
  const [threatCount, setThreatCount] = useState(0);

  const handleScanComplete = useCallback((threats: number) => {
    setScanCount((c) => c + 1);
    setThreatCount((c) => c + threats);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--background)" }}>
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="flex-1 overflow-y-auto">
        {activeView === "dashboard" && (
          <Dashboard
            scanCount={scanCount}
            threatCount={threatCount}
            onNavigate={setActiveView}
          />
        )}
        {activeView === "scanner" && (
          <Scanner onScanComplete={handleScanComplete} />
        )}
        {activeView === "threats" && <ThreatLog />}
        {activeView === "settings" && <Settings />}
      </main>
    </div>
  );
}
