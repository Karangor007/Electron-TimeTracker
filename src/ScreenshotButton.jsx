import React, { useState, useRef } from 'react';

export default function ScreenshotButton() {
    const [lastPath, setLastPath] = useState(null);
    const [tracking, setTracking] = useState(false);
    const trackerRef = useRef(null);


    const takeScreenshot = async () => {
        if (window.electronAPI) {
            const filePath = await window.electronAPI.takeScreenshot();
            setLastPath(filePath);
            alert("Screenshot saved at: " + filePath);
            console.log("Screenshot saved at:", filePath);
        } else {
            console.error("electronAPI is undefined — are you running in Electron?");
        }
    };

    const scheduleNextScreenshot = () => {
        // Random interval between 1–5 minutes
        const interval = Math.floor(Math.random() * (5 - 1 + 1) + 1) * 60 * 1000;

        trackerRef.current = setTimeout(async () => {
            await takeScreenshot();
            if (tracking) {
                scheduleNextScreenshot(); // schedule again if still tracking
            }
        }, interval);
    };

    const startTracking = () => {
        if (!tracking) {
            setTracking(true);
            scheduleNextScreenshot();
            alert("Tracking started! Screenshots will be taken at random intervals.");
        }
    };

    const stopTracking = () => {
        if (tracking) {
            setTracking(false);
            clearTimeout(trackerRef.current);
            alert("Tracking stopped.");
        }
    };

    return (
        <div>
            <button onClick={takeScreenshot}>Take Screenshot</button>
            <button onClick={startTracking} disabled={tracking}>
                Start Tracker
            </button>
            <button onClick={stopTracking} disabled={!tracking}>
                Stop Tracker
            </button>
            {lastPath && <p>Last screenshot: {lastPath}</p>}
        </div>
    );
}
