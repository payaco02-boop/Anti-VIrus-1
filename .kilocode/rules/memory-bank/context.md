# Active Context: ShieldAI Antivirus

## Current State

**App Status**: ✅ ShieldAI Antivirus — Fully Built

A complete AI-powered antivirus web application built with Next.js 16, featuring a dark cybersecurity UI, real-time file scanning with AI heuristics, threat log, settings panel, and a Windows .exe installer system via Electron + NSIS.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] ShieldAI Antivirus full UI (dark cybersecurity theme)
- [x] Sidebar navigation (Dashboard, Scanner, Threats, Settings)
- [x] Dashboard with stats, features, quick actions
- [x] AI Scanner with drag-and-drop, heuristic analysis, real-time results
- [x] Threat Log with filtering, expandable details, quarantine/delete actions
- [x] Settings panel with toggles, AI sensitivity slider, scan depth selector
- [x] API route `/api/scan` with MD5 hash, entropy analysis, signature DB
- [x] Electron main.js + preload.js for desktop app wrapper
- [x] NSIS installer script (installer/ShieldAI-Installer.nsi)
- [x] BUILD-INSTALLER.md guide for generating .exe
- [x] Fixed ffmpeg.dll missing error: removed custom NSIS include from package.json so electron-builder handles file bundling natively

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Main app shell with navigation state | ✅ Ready |
| `src/app/layout.tsx` | Root layout (ShieldAI title) | ✅ Ready |
| `src/app/globals.css` | Dark cybersecurity theme + animations | ✅ Ready |
| `src/app/api/scan/route.ts` | AI scan API (hash, heuristics, signatures) | ✅ Ready |
| `src/components/Sidebar.tsx` | Navigation sidebar | ✅ Ready |
| `src/components/Dashboard.tsx` | Stats + features overview | ✅ Ready |
| `src/components/Scanner.tsx` | File scanner with AI analysis | ✅ Ready |
| `src/components/ThreatLog.tsx` | Threat history + filtering | ✅ Ready |
| `src/components/Settings.tsx` | Protection settings + toggles | ✅ Ready |
| `electron/main.js` | Electron desktop wrapper | ✅ Ready |
| `electron/preload.js` | Electron IPC bridge | ✅ Ready |
| `installer/ShieldAI-Installer.nsi` | NSIS Windows installer script | ✅ Ready |
| `installer/license.txt` | EULA in Spanish | ✅ Ready |
| `BUILD-INSTALLER.md` | Guide to build .exe installer | ✅ Ready |

## Current Focus

The template is ready. Next steps depend on user requirements:

1. What type of application to build
2. What features are needed
3. Design/branding preferences

## Quick Start Guide

### To add a new page:

Create a file at `src/app/[route]/page.tsx`:
```tsx
export default function NewPage() {
  return <div>New page content</div>;
}
```

### To add components:

Create `src/components/` directory and add components:
```tsx
// src/components/ui/Button.tsx
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>;
}
```

### To add a database:

Follow `.kilocode/recipes/add-database.md`

### To add API routes:

Create `src/app/api/[route]/route.ts`:
```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Pending Improvements

- [ ] Add more recipes (auth, email, etc.)
- [ ] Add example components
- [ ] Add testing setup recipe

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-02-21 | Added GitHub Actions workflow `.github/workflows/build-installer.yml` to auto-build Windows .exe installer on push to main/master |
| 2026-02-21 | Fixed ffmpeg.dll error: switched from Next.js server mode to static export (`output: 'export'` in next.config.ts), updated electron/main.js to load `out/index.html` directly via `loadFile()`, removed API route (scan logic already client-side), simplified package.json build files config to only include `electron/**/*`, `out/**/*`, `package.json` |
| 2026-02-21 | Built .exe locally: added `electron/assets/icon.ico`, fixed NSIS `installerLanguages` from `["Spanish","English"]` to `["en_US","es_ES"]` (locale codes required), installed wine32 for rcedit. Output: `dist/ShieldAI Antivirus Setup 1.0.0.exe` (165MB) and `dist/ShieldAI-Antivirus-Portable-1.0.0.exe` (165MB) |
| 2026-02-21 | Fixed UI not rendering in Electron: added `assetPrefix: "./"` to `next.config.ts` so Next.js static export uses relative paths (`./_next/static/...`) instead of absolute paths (`/_next/static/...`) which break under Electron's `file://` protocol. Rebuilt both .exe installers and pushed to GitHub (payaco02-boop/Anti-VIrus-1) via Git LFS. |
