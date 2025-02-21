export const captureScreen = async (): Promise<string | null> => {
  // Check if running inside a Chrome extension
  const isChromeExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;

  try {
    if (isChromeExtension) {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'CAPTURE_SCREENSHOT' }, (response) => {
          resolve(response?.screenshot || null);
        });
      });
    } else {
      // Use MediaDevices API for screen capture in development mode
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const track = stream.getVideoTracks()[0];

      // Use built-in ImageCapture API (without importing anything)
      if ('ImageCapture' in window) {
        const imageCapture = new window.ImageCapture(track);
        const bitmap = await imageCapture.grabFrame();

        // Convert to Base64 image
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(bitmap, 0, 0);
          const base64Image = canvas.toDataURL('image/jpeg', 0.8);

          // Cleanup
          track.stop();
          stream.getTracks().forEach(track => track.stop());

          return base64Image;
        }
      }

      // If ImageCapture is not supported
      console.error('ImageCapture API is not supported in this browser.');
      return null;
    }
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return null;
  }
};
