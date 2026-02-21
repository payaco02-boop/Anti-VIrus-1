"use client";

import { useState } from "react";

interface ToggleProps {
  enabled: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}

function Toggle({ enabled, onChange, color = "#00d4ff" }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
      style={{
        background: enabled ? color : "#1e2d4a",
        boxShadow: enabled ? `0 0 10px ${color}66` : "none",
      }}
    >
      <div
        className="absolute top-1 w-4 h-4 rounded-full transition-all duration-300"
        style={{
          background: "#fff",
          left: enabled ? "calc(100% - 20px)" : "4px",
        }}
      />
    </button>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState({
    realTimeProtection: true,
    aiHeuristics: true,
    cloudAnalysis: true,
    autoQuarantine: true,
    deepScan: false,
    networkMonitor: true,
    emailProtection: false,
    autoUpdate: true,
    notifications: true,
    darkMode: true,
    scanOnBoot: false,
    behaviorAnalysis: true,
  });

  const [saved, setSaved] = useState(false);
  const [aiSensitivity, setAiSensitivity] = useState(75);
  const [scanDepth, setScanDepth] = useState(2);

  const saveSettings = () => {
    // Save to localStorage for persistence
    localStorage.setItem("shieldai_settings", JSON.stringify({ settings, aiSensitivity, scanDepth }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      title: "Protección en Tiempo Real",
      icon: "🛡️",
      color: "#00cc66",
      items: [
        { key: "realTimeProtection" as const, label: "Protección Activa", desc: "Monitoreo continuo del sistema" },
        { key: "networkMonitor" as const, label: "Monitor de Red", desc: "Detecta conexiones sospechosas" },
        { key: "behaviorAnalysis" as const, label: "Análisis de Comportamiento", desc: "Detecta actividad anómala" },
        { key: "emailProtection" as const, label: "Protección de Email", desc: "Escanea adjuntos de correo" },
      ],
    },
    {
      title: "Motor de Inteligencia Artificial",
      icon: "🧠",
      color: "#aa44ff",
      items: [
        { key: "aiHeuristics" as const, label: "Análisis Heurístico IA", desc: "Detecta amenazas desconocidas" },
        { key: "cloudAnalysis" as const, label: "Análisis en la Nube", desc: "Base de datos de 50M+ amenazas" },
        { key: "deepScan" as const, label: "Escaneo Profundo", desc: "Análisis exhaustivo (más lento)" },
      ],
    },
    {
      title: "Acciones Automáticas",
      icon: "⚡",
      color: "#ffaa00",
      items: [
        { key: "autoQuarantine" as const, label: "Cuarentena Automática", desc: "Aisla amenazas detectadas" },
        { key: "autoUpdate" as const, label: "Actualización Automática", desc: "Mantiene la IA actualizada" },
        { key: "scanOnBoot" as const, label: "Escaneo al Inicio", desc: "Analiza el sistema al arrancar" },
        { key: "notifications" as const, label: "Notificaciones", desc: "Alertas de amenazas detectadas" },
      ],
    },
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold gradient-text">Configuración</h2>
        <p className="mt-1" style={{ color: "#64748b" }}>
          Personaliza la protección de ShieldAI
        </p>
      </div>

      {/* AI Sensitivity slider */}
      <div
        className="rounded-xl p-6 mb-6 animate-fade-in"
        style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "#aa44ff22", border: "1px solid #aa44ff44" }}
          >
            🎯
          </div>
          <div>
            <h3 className="font-semibold text-white">Sensibilidad del Motor IA</h3>
            <p className="text-xs" style={{ color: "#64748b" }}>
              Mayor sensibilidad = más detecciones (puede generar falsos positivos)
            </p>
          </div>
          <span
            className="ml-auto text-2xl font-bold"
            style={{ color: "#aa44ff" }}
          >
            {aiSensitivity}%
          </span>
        </div>
        <input
          type="range"
          min={10}
          max={100}
          value={aiSensitivity}
          onChange={(e) => setAiSensitivity(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #aa44ff ${aiSensitivity}%, #1e2d4a ${aiSensitivity}%)`,
          }}
        />
        <div className="flex justify-between text-xs mt-2" style={{ color: "#475569" }}>
          <span>Conservador</span>
          <span>Equilibrado</span>
          <span>Agresivo</span>
        </div>
      </div>

      {/* Scan depth */}
      <div
        className="rounded-xl p-6 mb-6 animate-fade-in"
        style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "#00d4ff22", border: "1px solid #00d4ff44" }}
          >
            🔬
          </div>
          <div>
            <h3 className="font-semibold text-white">Profundidad de Escaneo</h3>
            <p className="text-xs" style={{ color: "#64748b" }}>Nivel de análisis de archivos</p>
          </div>
        </div>
        <div className="flex gap-3">
          {[
            { value: 1, label: "Rápido", desc: "Solo archivos críticos" },
            { value: 2, label: "Normal", desc: "Archivos del sistema" },
            { value: 3, label: "Completo", desc: "Todo el disco" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setScanDepth(opt.value)}
              className="flex-1 p-3 rounded-xl text-center transition-all duration-200"
              style={{
                background: scanDepth === opt.value ? "#00d4ff22" : "#0a0e1a",
                border: `1px solid ${scanDepth === opt.value ? "#00d4ff" : "#1e2d4a"}`,
                color: scanDepth === opt.value ? "#00d4ff" : "#64748b",
              }}
            >
              <p className="font-semibold text-sm">{opt.label}</p>
              <p className="text-xs mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Toggle sections */}
      {sections.map((section, si) => (
        <div
          key={si}
          className="rounded-xl overflow-hidden mb-6 animate-fade-in"
          style={{ border: "1px solid var(--card-border)", animationDelay: `${si * 0.1}s` }}
        >
          <div
            className="px-5 py-4 flex items-center gap-3 border-b"
            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${section.color}22`, border: `1px solid ${section.color}44` }}
            >
              {section.icon}
            </div>
            <h3 className="font-semibold text-white">{section.title}</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "#1e2d4a" }}>
            {section.items.map((item) => (
              <div
                key={item.key}
                className="px-5 py-4 flex items-center justify-between"
                style={{ background: "var(--card-bg)" }}
              >
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{item.desc}</p>
                </div>
                <Toggle
                  enabled={settings[item.key]}
                  onChange={() => toggle(item.key)}
                  color={section.color}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Save button */}
      <button
        onClick={saveSettings}
        className="w-full py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105 animate-fade-in"
        style={{
          background: saved ? "#00cc66" : "linear-gradient(135deg, #00d4ff, #0066ff)",
          color: "#000",
          boxShadow: saved ? "0 4px 20px #00cc6644" : "0 4px 20px #00d4ff44",
        }}
      >
        {saved ? "✅ Configuración Guardada" : "💾 Guardar Configuración"}
      </button>
    </div>
  );
}
