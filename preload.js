const { contextBridge, desktopCapturer } = require("electron");
const fs = require("fs");
const path = require("path");
const { app } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    takeScreenshot: async () => {
        const sources = await desktopCapturer.getSources({ types: ["screen"] });
        const screenSource = sources[0];
        const image = screenSource.thumbnail.toPNG();

        const screenshotsDir = path.join(app.getPath("pictures"), "TimeTrackerScreenshots");
        if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

        const filePath = path.join(screenshotsDir, `screenshot_${Date.now()}.png`);
        fs.writeFileSync(filePath, image);

        return filePath;
    },
});
