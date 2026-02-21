const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
  openFolderDialog: () => ipcRenderer.invoke("open-folder-dialog"),
  isElectron: true,
});
