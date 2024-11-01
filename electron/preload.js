try {
  const { contextBridge, ipcRenderer } = require('electron');

  contextBridge.exposeInMainWorld('electron', {
    printQueue: (data) => ipcRenderer.send('print-queue', data),
    onPrintResponse: (callback) => ipcRenderer.on('print-response', (event, response) => callback(response)),
  });
} catch (error) {
  console.error('Preload script error:', error);
}