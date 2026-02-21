const { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain, dialog, shell } = require("electron");
const path = require("path");

let mainWindow = null;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: "ShieldAI Antivirus",
    icon: path.join(__dirname, "assets", "icon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    frame: true,
    backgroundColor: "#0a0e1a",
    show: false,
  });

  // Remove default menu
  Menu.setApplicationMenu(null);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Minimize to tray instead of closing
  mainWindow.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Load static Next.js export
  const indexPath = path.join(__dirname, "..", "out", "index.html");
  mainWindow.loadFile(indexPath);
}

function createTray() {
  // Create a simple tray icon
  const iconPath = path.join(__dirname, "assets", "tray-icon.png");
  let trayIcon;
  try {
    trayIcon = nativeImage.createFromPath(iconPath);
  } catch {
    trayIcon = nativeImage.createEmpty();
  }

  tray = new Tray(trayIcon);
  tray.setToolTip("ShieldAI Antivirus - Protección Activa");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "🛡️ ShieldAI Antivirus",
      enabled: false,
    },
    { type: "separator" },
    {
      label: "Abrir ShieldAI",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    {
      label: "Escaneo Rápido",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.webContents.executeJavaScript(
            "window.__shieldai_navigate && window.__shieldai_navigate('scanner')"
          );
        }
      },
    },
    { type: "separator" },
    {
      label: "Estado: Protegido ✅",
      enabled: false,
    },
    { type: "separator" },
    {
      label: "Salir",
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on("double-click", () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

app.whenReady().then(() => {
  // Show loading splash
  const splash = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    backgroundColor: "#0a0e1a",
    webPreferences: { nodeIntegration: false },
  });

  splash.loadURL(`data:text/html,
    <html>
    <body style="margin:0;background:#0a0e1a;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:system-ui;color:#e2e8f0;">
      <div style="font-size:64px;margin-bottom:16px">🛡️</div>
      <h1 style="margin:0;font-size:24px;background:linear-gradient(135deg,#00d4ff,#0066ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent">ShieldAI Antivirus</h1>
      <p style="color:#64748b;margin-top:8px;font-size:14px">Iniciando protección IA...</p>
      <div style="margin-top:24px;width:200px;height:4px;background:#1e2d4a;border-radius:2px;overflow:hidden">
        <div id="bar" style="height:100%;width:0%;background:linear-gradient(90deg,#00d4ff,#0066ff);border-radius:2px;transition:width 0.3s"></div>
      </div>
      <script>
        let w = 0;
        const bar = document.getElementById('bar');
        const iv = setInterval(() => { w = Math.min(90, w + Math.random() * 15); bar.style.width = w + '%'; if(w >= 90) clearInterval(iv); }, 300);
      </script>
    </body>
    </html>
  `);

  // Brief splash delay then load app
  setTimeout(() => {
    splash.close();
    createTray();
    createWindow();
  }, 2000);
});

app.on("window-all-closed", () => {
  // Keep running in tray on Windows/Linux
  if (process.platform === "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

app.on("before-quit", () => {
  app.isQuitting = true;
});

// IPC handlers
ipcMain.handle("get-app-version", () => app.getVersion());
ipcMain.handle("open-file-dialog", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile", "multiSelections"],
    title: "Seleccionar archivos para escanear",
  });
  return result.filePaths;
});
ipcMain.handle("open-folder-dialog", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
    title: "Seleccionar carpeta para escanear",
  });
  return result.filePaths;
});
