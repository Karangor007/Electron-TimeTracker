import React, { useState, useRef, useEffect } from 'react';

export default function ScreenshotButton() {
    const [tracking, setTracking] = useState(false);
    const [lastPath, setLastPath] = useState(null);
    const [seconds, setSeconds] = useState(0);
    const trackerRef = useRef(null);
    const timerRef = useRef(null);

    // Format HH:MM:SS
    const formatTime = (secs) => {
        const h = String(Math.floor(secs / 3600)).padStart(2, "0");
        const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
        const s = String(secs % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

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
        const interval = Math.floor(Math.random() * (5 - 1 + 1) + 1) * 60 * 1000; // 1–5 min
        trackerRef.current = setTimeout(async () => {
            await takeScreenshot();
            if (tracking) {
                scheduleNextScreenshot();
            }
        }, interval);
    };

    const startTracking = () => {
        if (!tracking) {
            setTracking(true);
            setSeconds(0);
            scheduleNextScreenshot();
            timerRef.current = setInterval(() => setSeconds((prev) => prev + 1), 1000);
            alert("Tracking started!");
        }
    };

    const stopTracking = () => {
        if (tracking) {
            setTracking(false);
            clearTimeout(trackerRef.current);
            clearInterval(timerRef.current);
            alert("Tracking stopped.");
        }
    };

    useEffect(() => {
        return () => {
            clearTimeout(trackerRef.current);
            clearInterval(timerRef.current);
        };
    }, []);

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Time Tracker</h2>

            <button
                onClick={startTracking}
                disabled={tracking}
                style={{ ...styles.button, backgroundColor: "#d3d3d3", cursor: tracking ? "not-allowed" : "pointer" }}
            >
                Start Tracking
            </button>

            <button
                onClick={stopTracking}
                disabled={!tracking}
                style={{ ...styles.button, backgroundColor: "#fff", border: "1px solid #007bff", color: "#007bff" }}
            >
                Stop Tracking
            </button>

            <button style={{ ...styles.button, backgroundColor: "#f0f0f0" }}>
                Change Password
            </button>

            <button style={{ ...styles.button, backgroundColor: "#ff6600", color: "white" }}>
                Signout
            </button>

            <div style={styles.infoSection}>
                <p style={{ fontWeight: "bold" }}>Productive Time</p>
                <h3 style={styles.timer}>{formatTime(seconds)}</h3>
            </div>

            <div style={styles.statusRow}>
                <span style={{ fontWeight: "bold" }}>Tracker Status:</span>
                <div
                    style={{
                        ...styles.statusBox,
                        backgroundColor: tracking ? "green" : "red",
                    }}
                />
            </div>

            {lastPath && (
                <p style={{ fontSize: "12px", marginTop: "10px" }}>
                    Last screenshot: {lastPath}
                </p>
            )}

            <button onClick={takeScreenshot} style={{ ...styles.button, marginTop: "10px" }}>
                Take Screenshot
            </button>

            <footer style={styles.footer}>
                <span>Copyright © 2025 </span>
                <span style={{ color: "#e74c3c", fontWeight: "bold" }}>TRETA</span>
                <span> Infotech</span>
                <span style={{ marginLeft: "auto" }}>Version 1.0.4</span>
            </footer>
        </div>
    );
}

const styles = {
    container: {
        width: "300px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        textAlign: "center",
        backgroundColor: "#f5f9fc",
        fontFamily: "Arial, sans-serif",
    },
    title: {
        fontWeight: "bold",
        marginBottom: "20px",
    },
    button: {
        display: "block",
        width: "100%",
        padding: "10px",
        margin: "8px 0",
        borderRadius: "5px",
        border: "none",
        fontSize: "14px",
        cursor: "pointer",
    },
    infoSection: {
        marginTop: "20px",
    },
    timer: {
        fontSize: "22px",
        color: "green",
        fontWeight: "bold",
        margin: "5px 0",
    },
    statusRow: {
        marginTop: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
    },
    statusBox: {
        width: "20px",
        height: "20px",
        border: "1px solid black",
    },
    footer: {
        marginTop: "20px",
        fontSize: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
};
