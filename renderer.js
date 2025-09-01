const handleScreenshot = async () => {
    if (window.electronAPI) {
        const filePath = await window.electronAPI.takeScreenshot();
        console.log('Screenshot saved at:', filePath);
    } else {
        console.error('electronAPI is undefined');
    }
};
