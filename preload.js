const { contextBridge, ipcRenderer } = require('electron');

console.log("Preload script loaded!");


contextBridge.exposeInMainWorld('electronAPI', {
    takeScreenshot: () => ipcRenderer.invoke('take-screenshot')
});
