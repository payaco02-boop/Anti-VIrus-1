"use client";

import { useState } from "react";

interface Threat {
  id: number;
  name: string;
  file: string;
  path: string;
  level: "critical" | "high" | "medium" | "low";
  date: string;
  status: "quarantined" | "deleted" | "ignored";
  type: string;
}

const MOCK_THREATS: Threat[] = [
  {
    id: 1,
    name: "Trojan.GenericKD.47291",
    file: "setup_crack.exe",
    path: "C:\\Downloads\\setup_crack.exe",
    level: "critical",
    date: "2025-02-20 14:32",
    status: "quarantined",
    type: "Troyano",
  },
  {
    id: 2,
    name: "PUA.Crack.Tool.Generic",
    file: "keygen_v2.exe",
    path: "C:\\Users\\User\\Desktop\\keygen_v2.exe",
    level: "medium",
    date: "2025-02-19 09:15",
    status: "deleted",
    type: "Herramienta PUA",
  },
  {
    id: 3,
    name: "Heuristic.Suspicious.Behavior",
    file: "update_patch.bat",
    path: "C:\\Temp\\update_patch.bat",
    level: "medium",
    date: "2025-02-18 22:47",
    status: "quarantined",
    type: "Heurístico",
  },
  {
    id: 4,
    name: "Spyware.Keylogger.Win32",
    file: "monitor.dll",
    path: "C:\\Windows\\System32\\monitor.dll",
    level: "high",
    date: "2025-02-17 11:03",
    status: "deleted",
    type: "Spyware",
  },
  {
    id: 5,
    name: "Adware.BrowserHijack",
    file: "browser_ext.crx",
    path: "C:\\AppData\\browser_ext.crx",
    level: "low",
    date: "2025-02-15 16:20",
    status: "ignored",
    type: "Adware",
  },
];

const levelColors: Record<string, string> = {
  critical: "#ff2222",
  high: "#ff6600",
  medium: "#ffaa00",
  low: "#00cc66",
};

const levelLabels: Record<string, string> = {
  critical: "CRÍTICO",
  high: "ALTO",
  medium: "MEDIO",
  low: "BAJO",
};

const statusColors: Record<string, string> = {
  quarantined: "#ffaa00",
  deleted: "#ff4444",
  ignored: "#64748b",
};

const statusLabels: Record<string, string> = {
  quarantined: "En Cuarentena",
  deleted: "Eliminado",
  ignored: "Ignorado",
};

export default function ThreatLog() {
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all");
  const [selected, setSelected] = useState<Threat | null>(null);
  const [threats, setThreats] = useState<Threat[]>(MOCK_THREATS);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const filtered = threats.filter((t) => filter === "all" || t.level === filter);

  const handleAction = (threatId: number, action: "delete" | "quarantine" | "ignore") => {
    setThreats((prev) =>
      prev.map((t) =>
        t.id === threatId
          ? { ...t, status: action === "delete" ? "deleted" : action === "quarantine" ? "quarantined" : "ignored" }
          : t
      )
    );
    const actionText = action === "delete" ? "eliminado" : action === "quarantine" ? "enviado a cuarentena" : "ignorado";
    setActionMessage(`Amenaza ${actionText}`);
    setTimeout(() => setActionMessage(null), 3000);
    setSelected(null);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold gradient-text">Registro de Amenazas</h2>
        <p className="mt-1" style={{ color: "#64748b" }}>
          Historial completo de amenazas detectadas por la IA
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fade-in">
        {[
          { level: "critical", count: threats.filter((t) => t.level === "critical").length, icon: "🔴" },
          { level: "high", count: threats.filter((t) => t.level === "high").length, icon: "🟠" },
          { level: "medium", count: threats.filter((t) => t.level === "medium").length, icon: "🟡" },
          { level: "low", count: threats.filter((t) => t.level === "low").length, icon: "🟢" },
        ].map((s) => (
          <button
            key={s.level}
            onClick={() => setFilter(filter === s.level ? "all" : s.level as typeof filter)}
            className="rounded-xl p-4 text-center transition-all duration-200 hover:scale-105"
            style={{
              background: filter === s.level ? `${levelColors[s.level]}22` : "var(--card-bg)",
              border: `1px solid ${filter === s.level ? levelColors[s.level] : "var(--card-border)"}`,
            }}
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-xl font-bold" style={{ color: levelColors[s.level] }}>{s.count}</div>
            <div className="text-xs mt-1" style={{ color: "#64748b" }}>{levelLabels[s.level]}</div>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div
        className="flex items-center gap-2 mb-4 p-3 rounded-xl animate-fade-in"
        style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
      >
        <span className="text-sm" style={{ color: "#64748b" }}>Filtrar:</span>
        {(["all", "critical", "high", "medium", "low"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
            style={{
              background: filter === f ? "#00d4ff22" : "transparent",
              color: filter === f ? "#00d4ff" : "#64748b",
              border: filter === f ? "1px solid #00d4ff44" : "1px solid transparent",
            }}
          >
            {f === "all" ? "Todos" : levelLabels[f]}
          </button>
        ))}
        <span className="ml-auto text-xs" style={{ color: "#64748b" }}>
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Threat list */}
      <div
        className="rounded-xl overflow-hidden animate-fade-in"
        style={{ border: "1px solid var(--card-border)" }}
      >
        {filtered.length === 0 ? (
          <div className="p-12 text-center" style={{ background: "var(--card-bg)" }}>
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white font-semibold">No hay amenazas en este nivel</p>
            <p className="text-sm mt-1" style={{ color: "#64748b" }}>Tu sistema está limpio</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "#1e2d4a" }}>
            {filtered.map((threat) => (
              <div
                key={threat.id}
                className="px-5 py-4 cursor-pointer transition-all duration-200"
                style={{
                  background: selected?.id === threat.id ? "#00d4ff08" : "var(--card-bg)",
                }}
                onClick={() => setSelected(selected?.id === threat.id ? null : threat)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{
                      background: `${levelColors[threat.level]}22`,
                      border: `1px solid ${levelColors[threat.level]}44`,
                    }}
                  >
                    🦠
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white font-mono">{threat.name}</p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{
                          background: `${levelColors[threat.level]}22`,
                          color: levelColors[threat.level],
                        }}
                      >
                        {levelLabels[threat.level]}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "#64748b" }}>
                      {threat.path}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{
                        background: `${statusColors[threat.status]}22`,
                        color: statusColors[threat.status],
                      }}
                    >
                      {statusLabels[threat.status]}
                    </span>
                    <p className="text-xs mt-1" style={{ color: "#475569" }}>{threat.date}</p>
                  </div>
                </div>

                {/* Expanded details */}
                {selected?.id === threat.id && (
                  <div
                    className="mt-4 p-4 rounded-xl animate-fade-in"
                    style={{ background: "#0a0e1a", border: "1px solid #1e2d4a" }}
                  >
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {[
                        { label: "Tipo de Amenaza", value: threat.type },
                        { label: "Archivo", value: threat.file },
                        { label: "Nivel de Riesgo", value: levelLabels[threat.level] },
                        { label: "Estado", value: statusLabels[threat.status] },
                        { label: "Detectado", value: threat.date },
                        { label: "Ruta Completa", value: threat.path },
                      ].map((item, i) => (
                        <div key={i}>
                          <p style={{ color: "#475569" }}>{item.label}</p>
                          <p className="font-medium text-white mt-0.5 font-mono">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAction(threat.id, "delete"); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                        style={{ background: "#ff444422", color: "#ff4444", border: "1px solid #ff444444" }}
                      >
                        🗑️ Eliminar
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAction(threat.id, "quarantine"); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                        style={{ background: "#ffaa0022", color: "#ffaa00", border: "1px solid #ffaa0044" }}
                      >
                        📦 Cuarentena
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAction(threat.id, "ignore"); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                        style={{ background: "#1e2d4a", color: "#64748b" }}
                      >
                        ✓ Ignorar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
