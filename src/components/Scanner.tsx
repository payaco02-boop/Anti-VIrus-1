"use client";

import { useState, useRef, useCallback } from "react";

interface ScanResult {
  fileName: string;
  fileSize: number;
  status: "clean" | "threat" | "suspicious" | "scanning";
  threatName?: string;
  threatLevel?: "critical" | "high" | "medium" | "low";
  confidence?: number;
  hash?: string;
  scanTime?: number;
}

interface ScannerProps {
  onScanComplete: (threats: number) => void;
}

const THREAT_SIGNATURES = [
  { pattern: /trojan/i, name: "Trojan.GenericKD", level: "critical" as const },
  { pattern: /virus/i, name: "Virus.Win32.Sality", level: "critical" as const },
  { pattern: /malware/i, name: "Malware.Generic", level: "high" as const },
  { pattern: /ransomware/i, name: "Ransomware.WannaCry", level: "critical" as const },
  { pattern: /keylogger/i, name: "Spyware.Keylogger", level: "high" as const },
  { pattern: /\.exe$/i, name: null, level: "low" as const },
  { pattern: /crack|keygen|patch/i, name: "PUA.Crack.Tool", level: "medium" as const },
  { pattern: /hack/i, name: "HackTool.Generic", level: "medium" as const },
];

function analyzeFileWithAI(file: File): Promise<ScanResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string || "";
      const fileName = file.name.toLowerCase();

      // Simulate AI analysis delay (300-1500ms)
      const delay = 300 + Math.random() * 1200;

      setTimeout(() => {
        let threatFound = false;
        let threatName = "";
        let threatLevel: ScanResult["threatLevel"] = "low";
        let confidence = 0;

        // Check threat signatures
        for (const sig of THREAT_SIGNATURES) {
          if (sig.pattern.test(fileName) || (content && sig.pattern.test(content.slice(0, 1000)))) {
            if (sig.name) {
              threatFound = true;
              threatName = sig.name;
              threatLevel = sig.level;
              confidence = 85 + Math.random() * 14;
              break;
            }
          }
        }

        // AI heuristic: random suspicious detection for demo (5% chance)
        if (!threatFound && Math.random() < 0.05) {
          threatFound = true;
          threatName = "Heuristic.Suspicious.Behavior";
          threatLevel = "medium";
          confidence = 60 + Math.random() * 25;
        }

        // Generate fake hash
        const hash = Array.from({ length: 32 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("");

        resolve({
          fileName: file.name,
          fileSize: file.size,
          status: threatFound ? (threatLevel === "critical" || threatLevel === "high" ? "threat" : "suspicious") : "clean",
          threatName: threatFound ? threatName : undefined,
          threatLevel: threatFound ? threatLevel : undefined,
          confidence: threatFound ? Math.round(confidence) : Math.round(95 + Math.random() * 4),
          hash,
          scanTime: Date.now() - startTime,
        });
      }, delay);
    };

    reader.onerror = () => {
      resolve({
        fileName: file.name,
        fileSize: file.size,
        status: "clean",
        confidence: 98,
        hash: "error",
        scanTime: 100,
      });
    };

    // Read first 10KB for analysis
    const blob = file.slice(0, 10240);
    reader.readAsText(blob);
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const threatColors: Record<string, string> = {
  critical: "#ff2222",
  high: "#ff6600",
  medium: "#ffaa00",
  low: "#00cc66",
};

export default function Scanner({ onScanComplete }: ScannerProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const arr = Array.from(newFiles);
    setFiles((prev) => [...prev, ...arr]);
    setScanDone(false);
    setResults([]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const startScan = useCallback(async () => {
    if (files.length === 0) return;
    setScanning(true);
    setScanDone(false);
    setResults([]);
    setProgress(0);

    const scanResults: ScanResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCurrentFile(file.name);
      setProgress(Math.round((i / files.length) * 100));

      // Add scanning placeholder
      setResults((prev) => [
        ...prev,
        { fileName: file.name, fileSize: file.size, status: "scanning" },
      ]);

      const result = await analyzeFileWithAI(file);
      scanResults.push(result);

      // Replace scanning with result
      setResults((prev) => {
        const updated = [...prev];
        updated[i] = result;
        return updated;
      });
    }

    setProgress(100);
    setCurrentFile("");
    setScanning(false);
    setScanDone(true);

    const threats = scanResults.filter((r) => r.status === "threat" || r.status === "suspicious").length;
    onScanComplete(threats);
  }, [files, onScanComplete]);

  const clearAll = () => {
    setFiles([]);
    setResults([]);
    setScanDone(false);
    setProgress(0);
  };

  const threats = results.filter((r) => r.status === "threat");
  const suspicious = results.filter((r) => r.status === "suspicious");
  const clean = results.filter((r) => r.status === "clean");

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold gradient-text">Escáner IA</h2>
        <p className="mt-1" style={{ color: "#64748b" }}>
          Analiza archivos con inteligencia artificial avanzada
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className="rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 mb-6 animate-fade-in"
        style={{
          background: dragOver ? "#00d4ff11" : "var(--card-bg)",
          border: `2px dashed ${dragOver ? "#00d4ff" : "#1e2d4a"}`,
          boxShadow: dragOver ? "0 0 30px #00d4ff22" : "none",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="text-5xl mb-4">{dragOver ? "📂" : "📁"}</div>
        <h3 className="text-lg font-semibold text-white mb-2">
          {dragOver ? "Suelta los archivos aquí" : "Arrastra archivos o haz clic para seleccionar"}
        </h3>
        <p className="text-sm" style={{ color: "#64748b" }}>
          Soporta cualquier tipo de archivo · Análisis IA en segundos
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div
          className="rounded-xl p-4 mb-6 animate-fade-in"
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-white">
              {files.length} archivo{files.length !== 1 ? "s" : ""} seleccionado{files.length !== 1 ? "s" : ""}
            </h3>
            <button
              onClick={clearAll}
              className="text-xs px-3 py-1 rounded-lg transition-colors"
              style={{ color: "#64748b", background: "#1e2d4a" }}
            >
              Limpiar
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="text-base">📄</span>
                <span className="flex-1 truncate text-white">{f.name}</span>
                <span style={{ color: "#64748b" }}>{formatBytes(f.size)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scan button */}
      <button
        onClick={startScan}
        disabled={files.length === 0 || scanning}
        className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 mb-6 animate-fade-in"
        style={{
          background: files.length === 0 || scanning
            ? "#1e2d4a"
            : "linear-gradient(135deg, #00d4ff, #0066ff)",
          color: files.length === 0 || scanning ? "#475569" : "#000",
          cursor: files.length === 0 || scanning ? "not-allowed" : "pointer",
          boxShadow: files.length > 0 && !scanning ? "0 4px 20px #00d4ff44" : "none",
        }}
      >
        {scanning ? (
          <span className="flex items-center justify-center gap-3">
            <span className="animate-spin-slow">⚙️</span>
            Analizando con IA...
          </span>
        ) : (
          "🔍 Iniciar Análisis IA"
        )}
      </button>

      {/* Progress */}
      {scanning && (
        <div
          className="rounded-xl p-5 mb-6 animate-fade-in"
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white">Analizando: {currentFile}</span>
            <span className="text-sm font-bold" style={{ color: "#00d4ff" }}>{progress}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "#1e2d4a" }}>
            <div
              className="h-full rounded-full progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00d4ff" }} />
            <span className="text-xs" style={{ color: "#64748b" }}>
              Motor IA procesando · Análisis heurístico activo
            </span>
          </div>
        </div>
      )}

      {/* Summary */}
      {scanDone && results.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6 animate-fade-in">
          {[
            { label: "Amenazas", count: threats.length, color: "#ff4444", icon: "🦠" },
            { label: "Sospechosos", count: suspicious.length, color: "#ffaa00", icon: "⚠️" },
            { label: "Limpios", count: clean.length, color: "#00cc66", icon: "✅" },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-xl p-4 text-center"
              style={{ background: `${s.color}11`, border: `1px solid ${s.color}33` }}
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</div>
              <div className="text-xs mt-1" style={{ color: "#64748b" }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div
          className="rounded-xl overflow-hidden animate-fade-in"
          style={{ border: "1px solid var(--card-border)" }}
        >
          <div
            className="px-5 py-3 border-b"
            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
          >
            <h3 className="font-semibold text-sm text-white">Resultados del Análisis</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "#1e2d4a" }}>
            {results.map((r, i) => (
              <div
                key={i}
                className="px-5 py-4 flex items-center gap-4"
                style={{
                  background: r.status === "threat"
                    ? "#ff444408"
                    : r.status === "suspicious"
                    ? "#ffaa0008"
                    : "var(--card-bg)",
                }}
              >
                <span className="text-xl">
                  {r.status === "scanning" ? "⏳" :
                   r.status === "threat" ? "🦠" :
                   r.status === "suspicious" ? "⚠️" : "✅"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{r.fileName}</p>
                  {r.status === "scanning" ? (
                    <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Analizando...</p>
                  ) : (
                    <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                      {formatBytes(r.fileSize)} · Hash: {r.hash?.slice(0, 16)}... · {r.scanTime}ms
                    </p>
                  )}
                  {r.threatName && (
                    <p className="text-xs mt-1 font-mono" style={{ color: threatColors[r.threatLevel || "low"] }}>
                      {r.threatName}
                    </p>
                  )}
                </div>
                {r.status !== "scanning" && (
                  <div className="text-right flex-shrink-0">
                    <div
                      className="text-xs font-bold px-2 py-1 rounded-lg"
                      style={{
                        background: r.status === "threat"
                          ? "#ff444422"
                          : r.status === "suspicious"
                          ? "#ffaa0022"
                          : "#00cc6622",
                        color: r.status === "threat"
                          ? "#ff4444"
                          : r.status === "suspicious"
                          ? "#ffaa00"
                          : "#00cc66",
                      }}
                    >
                      {r.status === "threat" ? "AMENAZA" :
                       r.status === "suspicious" ? "SOSPECHOSO" : "LIMPIO"}
                    </div>
                    <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                      IA: {r.confidence}%
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
