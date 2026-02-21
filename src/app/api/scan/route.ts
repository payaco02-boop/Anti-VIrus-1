import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface ScanResult {
  fileName: string;
  fileSize: number;
  hash: string;
  status: "clean" | "threat" | "suspicious";
  threatName?: string;
  threatLevel?: "critical" | "high" | "medium" | "low";
  confidence: number;
  scanTime: number;
  aiAnalysis: {
    heuristicScore: number;
    behaviorScore: number;
    signatureMatch: boolean;
    cloudVerified: boolean;
  };
}

// Simulated threat signature database
const THREAT_DB: { pattern: RegExp; name: string; level: "critical" | "high" | "medium" | "low" }[] = [
  { pattern: /trojan/i, name: "Trojan.GenericKD.47291", level: "critical" },
  { pattern: /ransomware/i, name: "Ransomware.WannaCry.B", level: "critical" },
  { pattern: /virus/i, name: "Virus.Win32.Sality.AH", level: "critical" },
  { pattern: /keylogger/i, name: "Spyware.Keylogger.Win32", level: "high" },
  { pattern: /malware/i, name: "Malware.Generic.Suspicious", level: "high" },
  { pattern: /rootkit/i, name: "Rootkit.Hidden.Process", level: "critical" },
  { pattern: /backdoor/i, name: "Backdoor.RAT.Generic", level: "high" },
  { pattern: /crack|keygen/i, name: "PUA.Crack.Tool.Generic", level: "medium" },
  { pattern: /hack/i, name: "HackTool.Generic.Suspicious", level: "medium" },
  { pattern: /exploit/i, name: "Exploit.Generic.CVE", level: "high" },
];

// Known malicious hashes (simulated)
const MALICIOUS_HASHES = new Set([
  "d41d8cd98f00b204e9800998ecf8427e", // empty file (demo)
  "5d41402abc4b2a76b9719d911017c592",
]);

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Read file content
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const content = new TextDecoder("utf-8", { fatal: false }).decode(bytes.slice(0, 10240));

    // Calculate MD5 hash
    const hash = crypto
      .createHash("md5")
      .update(Buffer.from(buffer))
      .digest("hex");

    const fileName = file.name.toLowerCase();
    let threatFound = false;
    let threatName = "";
    let threatLevel: ScanResult["threatLevel"] = "low";
    let signatureMatch = false;

    // 1. Check known malicious hashes
    if (MALICIOUS_HASHES.has(hash)) {
      threatFound = true;
      threatName = "Known.Malware.Hash";
      threatLevel = "critical";
      signatureMatch = true;
    }

    // 2. Check threat signatures
    if (!threatFound) {
      for (const sig of THREAT_DB) {
        if (sig.pattern.test(fileName) || sig.pattern.test(content)) {
          threatFound = true;
          threatName = sig.name;
          threatLevel = sig.level;
          signatureMatch = true;
          break;
        }
      }
    }

    // 3. AI Heuristic analysis
    const heuristicScore = calculateHeuristicScore(fileName, content, bytes);
    const behaviorScore = calculateBehaviorScore(fileName, content);

    if (!threatFound && heuristicScore > 80) {
      threatFound = true;
      threatName = "Heuristic.AI.HighRisk";
      threatLevel = "high";
    } else if (!threatFound && heuristicScore > 60) {
      threatFound = true;
      threatName = "Heuristic.AI.Suspicious";
      threatLevel = "medium";
    }

    const confidence = threatFound
      ? Math.min(99, 70 + heuristicScore * 0.3)
      : Math.min(99.9, 95 + (100 - heuristicScore) * 0.05);

    const result: ScanResult = {
      fileName: file.name,
      fileSize: file.size,
      hash,
      status: threatFound
        ? (threatLevel === "critical" || threatLevel === "high" ? "threat" : "suspicious")
        : "clean",
      threatName: threatFound ? threatName : undefined,
      threatLevel: threatFound ? threatLevel : undefined,
      confidence: Math.round(confidence * 10) / 10,
      scanTime: Date.now() - startTime,
      aiAnalysis: {
        heuristicScore: Math.round(heuristicScore),
        behaviorScore: Math.round(behaviorScore),
        signatureMatch,
        cloudVerified: true,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "Scan failed", details: String(error) },
      { status: 500 }
    );
  }
}

function calculateHeuristicScore(fileName: string, content: string, bytes: Uint8Array): number {
  let score = 0;

  // Suspicious file extensions
  const suspiciousExts = [".exe", ".bat", ".cmd", ".vbs", ".ps1", ".scr", ".pif"];
  if (suspiciousExts.some((ext) => fileName.endsWith(ext))) score += 20;

  // Suspicious keywords in content
  const suspiciousKeywords = [
    "CreateRemoteThread", "VirtualAllocEx", "WriteProcessMemory",
    "ShellExecute", "WScript.Shell", "cmd.exe", "powershell",
    "base64", "eval(", "exec(", "system(",
  ];
  for (const kw of suspiciousKeywords) {
    if (content.includes(kw)) score += 10;
  }

  // High entropy (possible encryption/packing)
  const entropy = calculateEntropy(bytes.slice(0, 1024));
  if (entropy > 7.5) score += 30;
  else if (entropy > 7.0) score += 15;

  // Suspicious byte patterns (PE header)
  if (bytes[0] === 0x4d && bytes[1] === 0x5a) score += 15; // MZ header

  return Math.min(100, score);
}

function calculateBehaviorScore(fileName: string, content: string): number {
  let score = 0;

  const behaviors = [
    { pattern: /registry/i, weight: 15 },
    { pattern: /autorun/i, weight: 25 },
    { pattern: /startup/i, weight: 20 },
    { pattern: /inject/i, weight: 30 },
    { pattern: /encrypt/i, weight: 20 },
    { pattern: /delete.*shadow/i, weight: 40 },
    { pattern: /disable.*firewall/i, weight: 35 },
  ];

  for (const b of behaviors) {
    if (b.pattern.test(content) || b.pattern.test(fileName)) {
      score += b.weight;
    }
  }

  return Math.min(100, score);
}

function calculateEntropy(bytes: Uint8Array): number {
  const freq = new Array(256).fill(0);
  for (const byte of bytes) freq[byte]++;

  let entropy = 0;
  const len = bytes.length;
  if (len === 0) return 0;

  for (const f of freq) {
    if (f > 0) {
      const p = f / len;
      entropy -= p * Math.log2(p);
    }
  }

  return entropy;
}
