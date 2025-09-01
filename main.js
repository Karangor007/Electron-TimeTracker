const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

const isDev = !app.isPackaged; // check if running in dev or prod

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false, // security: keep false unless needed
            contextIsolation: true, // recommended
        },
    });

    if (isDev) {
        // React dev server
        win.loadURL('http://localhost:3000');
        win.webContents.openDevTools();
    } else {
        // React production build
        win.loadFile(path.join(__dirname, '../react-app/build/index.html'));
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
