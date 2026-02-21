"use client";

import { View } from "@/app/page";

interface DashboardProps {
  scanCount: number;
  threatCount: number;
  onNavigate: (view: View) => void;
}

const stats = [
  { label: "Archivos Escaneados", value: "0", icon: "📁", color: "#00d4ff" },
  { label: "Amenazas Detectadas", value: "0", icon: "🦠", color: "#ff4444" },
  { label: "Archivos Limpios", value: "0", icon: "✅", color: "#00cc66" },
  { label: "Precisión IA", value: "99.7%", icon: "🧠", color: "#aa44ff" },
];

const features = [
  {
    icon: "🧠",
    title: "Motor IA Avanzado",
    desc: "Detección de amenazas con machine learning en tiempo real",
    color: "#aa44ff",
  },
  {
    icon: "🔬",
    title: "Análisis Heurístico",
    desc: "Detecta malware desconocido por comportamiento sospechoso",
    color: "#00d4ff",
  },
  {
    icon: "🛡️",
    title: "Protección en Tiempo Real",
    desc: "Monitoreo continuo del sistema las 24 horas",
    color: "#00cc66",
  },
  {
    icon: "🔐",
    title: "Análisis de Hash",
    desc: "Verificación contra base de datos de 50M+ amenazas conocidas",
    color: "#ffaa00",
  },
];

export default function Dashboard({ scanCount, threatCount, onNavigate }: DashboardProps) {
  const dynamicStats = [
    { label: "Archivos Escaneados", value: scanCount.toString(), icon: "📁", color: "#00d4ff" },
    { label: "Amenazas Detectadas", value: threatCount.toString(), icon: "🦠", color: "#ff4444" },
    { label: "Archivos Limpios", value: Math.max(0, scanCount - threatCount).toString(), icon: "✅", color: "#00cc66" },
    { label: "Precisión IA", value: "99.7%", icon: "🧠", color: "#aa44ff" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold gradient-text">Panel de Control</h2>
        <p className="mt-1" style={{ color: "#64748b" }}>
          Bienvenido a ShieldAI — Tu sistema está protegido
        </p>
      </div>

      {/* Hero protection status */}
      <div
        className="relative rounded-2xl p-8 mb-8 overflow-hidden animate-fade-in"
        style={{
          background: "linear-gradient(135deg, #0f1629, #0a1628)",
          border: "1px solid #1e2d4a",
        }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ background: "radial-gradient(circle at 30% 50%, #00d4ff, transparent 60%)" }}
        />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ background: "#00cc66", boxShadow: "0 0 10px #00cc66" }}
              />
              <span className="font-semibold" style={{ color: "#00cc66" }}>
                Sistema Protegido
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              ShieldAI está activo y monitoreando
            </h3>
            <p style={{ color: "#64748b" }}>
              Motor IA v2.4 · Base de datos actualizada · Protección en tiempo real ON
            </p>
            <button
              onClick={() => onNavigate("scanner")}
              className="mt-4 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #00d4ff, #0066ff)",
                color: "#000",
                boxShadow: "0 4px 20px #00d4ff44",
              }}
            >
              🔍 Iniciar Escaneo
            </button>
          </div>
          <div className="hidden md:flex items-center justify-center w-32 h-32 relative">
            <div
              className="absolute inset-0 rounded-full opacity-20 animate-pulse"
              style={{ background: "#00d4ff", filter: "blur(20px)" }}
            />
            <span className="text-6xl shield-glow relative z-10">🛡️</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {dynamicStats.map((stat, i) => (
          <div
            key={i}
            className="rounded-xl p-5 animate-fade-in"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: stat.color, boxShadow: `0 0 6px ${stat.color}` }}
              />
            </div>
            <p
              className="text-2xl font-bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
            <p className="text-xs mt-1" style={{ color: "#64748b" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4" style={{ color: "#94a3b8" }}>
          Capacidades del Motor IA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-xl p-5 flex items-start gap-4 animate-fade-in"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${f.color}22`, border: `1px solid ${f.color}44` }}
              >
                {f.icon}
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">{f.title}</h4>
                <p className="text-xs mt-1" style={{ color: "#64748b" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Escaneo Rápido", desc: "Archivos críticos del sistema", icon: "⚡", view: "scanner" as View },
          { label: "Ver Amenazas", desc: "Historial de detecciones", icon: "📋", view: "threats" as View },
          { label: "Configuración", desc: "Ajustar protección IA", icon: "⚙️", view: "settings" as View },
        ].map((action, i) => (
          <button
            key={i}
            onClick={() => onNavigate(action.view)}
            className="rounded-xl p-5 text-left transition-all duration-200 hover:scale-105 animate-fade-in"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <span className="text-2xl">{action.icon}</span>
            <h4 className="font-semibold text-sm text-white mt-2">{action.label}</h4>
            <p className="text-xs mt-1" style={{ color: "#64748b" }}>{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
