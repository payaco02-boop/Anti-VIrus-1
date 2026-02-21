"use client";

import { View } from "@/app/page";

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const navItems: { id: View; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "scanner", label: "Escáner IA", icon: "🔍" },
  { id: "threats", label: "Amenazas", icon: "⚠️" },
  { id: "settings", label: "Ajustes", icon: "⚙️" },
];

export default function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <aside
      className="w-64 flex flex-col border-r"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
        minHeight: "100vh",
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: "var(--card-border)" }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "linear-gradient(135deg, #00d4ff22, #0066ff22)", border: "1px solid #00d4ff44" }}
            >
              🛡️
            </div>
            <div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
              style={{ background: "#00cc66", boxShadow: "0 0 6px #00cc66" }}
            />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none gradient-text">ShieldAI</h1>
            <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Antivirus Pro</p>
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div className="mx-4 mt-4 p-3 rounded-xl" style={{ background: "#00cc6611", border: "1px solid #00cc6633" }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00cc66" }} />
          <span className="text-xs font-medium" style={{ color: "#00cc66" }}>Protección Activa</span>
        </div>
        <p className="text-xs mt-1" style={{ color: "#64748b" }}>IA v2.4 · Actualizado</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200"
            style={{
              background: activeView === item.id ? "linear-gradient(135deg, #00d4ff22, #0066ff22)" : "transparent",
              border: activeView === item.id ? "1px solid #00d4ff44" : "1px solid transparent",
              color: activeView === item.id ? "#00d4ff" : "#94a3b8",
            }}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium text-sm">{item.label}</span>
            {activeView === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#00d4ff" }} />
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: "var(--card-border)" }}>
        <div className="text-xs text-center" style={{ color: "#475569" }}>
          <p>ShieldAI Antivirus v1.0</p>
          <p className="mt-0.5">© 2025 ShieldAI Corp</p>
        </div>
      </div>
    </aside>
  );
}
