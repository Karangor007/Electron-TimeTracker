import React, { useState } from 'react';

export default function ScreenshotButton() {
    const [lastPath, setLastPath] = useState(null);

    const handleScreenshot = async () => {
        if (window.electronAPI) {
            const filePath = await window.electronAPI.takeScreenshot();
            alert("Screenshot saved at: " + filePath);
            console.log("Screenshot saved at:", filePath);
        } else {
            console.error("electronAPI is undefined — are you running in Electron?");
        }
    };

    return (
        <div>
            <button onClick={handleScreenshot}>Take Screenshot</button>
            {lastPath && <p>Last screenshot: {lastPath}</p>}
        </div>
    );
}
