const { app, BrowserWindow, ipcMain, desktopCapturer } = require('electron');
const path = require('node:path');
const fs = require('fs');
const rootPath = require("path")

const isDev = process.env.NODE_ENV !== 'production';

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        },
    });

    if (isDev) {
        win.loadURL('http://localhost:8080');
        win.webContents.openDevTools();
    } else {
        win.loadURL(`file://${path.join(__dirname, '../renderer/index.html')}`);
    }
};

app.whenReady().then(() => {
    createWindow();

    // Screenshot handler
    ipcMain.handle('take-screenshot', async () => {
        const sources = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: { width: 1920, height: 1080 } // or use electron.screen API for actual size
        });
        const screenSource = sources[0];

        const image = screenSource.thumbnail.toPNG();
        // ✅ Save inside your project root/assets/screenshots
        const screenshotsDir = path.join(__dirname, 'assets', 'screenshots');

        if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

        const filePath = path.join(screenshotsDir, `screenshot_${Date.now()}.png`);
        fs.writeFileSync(filePath, image);

        return filePath;
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
