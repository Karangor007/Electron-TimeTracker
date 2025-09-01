import React, { useState } from 'react';

export default function ScreenshotButton() {
    const [lastPath, setLastPath] = useState(null);

    const handleScreenshot = async () => {
        try {
            const filePath = await window.electronAPI.takeScreenshot();
            alert(`Screenshot saved at: ${filePath}`);
        } catch (err) {
            console.error(err);
            alert("Failed to take screenshot");
        }
    };

    return (
        <div>
            <button onClick={handleScreenshot}>Take Screenshot</button>
            {lastPath && <p>Last screenshot: {lastPath}</p>}
        </div>
    );
}
