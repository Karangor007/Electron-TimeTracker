const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const isDev = process.env.NODE_ENV !== 'production';

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    const isDev = process.env.NODE_ENV !== 'production';

    if (isDev) {
        win.loadURL('http://localhost:8080');
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, 'dist/index.html'));
    }
};

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong');
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
