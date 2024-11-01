const { app, BrowserWindow, ipcMain } = require('electron');

const path = require('path');

const { spawn } = require('child_process');

const noble = require('@abandonware/noble');

// Disable hardware acceleration
app.disableHardwareAcceleration();

let currentPeripheral; // To store the connected peripheral
let mainWindow; // Declare mainWindow at the top level

// Bluetooth setup
noble.on('stateChange', (state) => {
  if (state === 'poweredOn') {
    noble.startScanning([], true);
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', (peripheral) => {
  if (peripheral.advertisement.localName === 'RPP02N') {
    console.log(`Discovered device: ${peripheral.advertisement.localName} - ${peripheral.id}`);
    noble.stopScanning();
    currentPeripheral = peripheral;

    peripheral.connect((error) => {
      if (error) {
        console.error(`Failed to connect: ${error}`);
      } else {
        console.log(`Connected to ${peripheral.advertisement.localName}`);

        // Discover services and send them to the renderer
        peripheral.discoverServices([], (error, services) => {
          if (error) {
            console.error(`Error discovering services: ${error}`);
            return;
          }
          const serviceUUIDs = services.map(service => service.uuid);
          mainWindow.webContents.send('discovered-services', serviceUUIDs); // Send discovered services
        });
      }
    });
  }
});

// Handle print requests
ipcMain.on('print-queue', (event, data) => {
  if (!currentPeripheral) {
    console.error('No connected Bluetooth device');
    event.reply('print-response', 'No connected Bluetooth device.');
    return;
  }

  console.log('Received request from Next.js to print:', data);

  const characteristicUUID = '49535343884143f4a8d4ecbe34729bb3'; // Start with the first discovered characteristic UUID
  const message = `\n${data}\n\n`;

  currentPeripheral.discoverServices([], (error, services) => {
    if (error) {
      console.error(`Error discovering services: ${error}`);
      event.reply('print-response', 'Error discovering services.');
      return;
    }

    const targetService = services.find(service => service.uuid === '49535343fe7d4ae58fa99fafd205e455'); // Ensure this is correct for your service
    if (targetService) {
      targetService.discoverCharacteristics([], (error, characteristics) => {
        if (error) {
          console.error(`Error discovering characteristics: ${error}`);
          event.reply('print-response', 'Error discovering characteristics.');
          return;
        }

        const targetCharacteristic = characteristics.find(characteristic => characteristic.uuid === characteristicUUID);
        if (targetCharacteristic) {
          targetCharacteristic.write(Buffer.from(message), true, (error) => {
            if (error) {
              console.error(`Error writing to characteristic: ${error}`);
              event.reply('print-response', 'Error writing to characteristic.');
            } else {
              console.log('Message sent to printer:', message);
              event.reply('print-response', 'Print job sent successfully!');
            }
          });
        } else {
          console.error(`Characteristic ${characteristicUUID} not found.`);
          event.reply('print-response', 'Characteristic not found.');
        }
      });
    } else {
      console.error('Target service not found.');
      event.reply('print-response', 'Target service not found.');
    }
  });
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'), // Ensure the preload script is set
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const appUrl = `file://${path.join(__dirname, '.next', 'server', 'pages', 'index.html')}`

  mainWindow.loadURL(appUrl);

  // Optional: Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

// Start Next.js server in production
const nextServer = spawn('npx', ['next', 'start']);
nextServer.stdout.on('data', data => console.log(`Next.js: ${data}`));
nextServer.stderr.on('data', data => console.error(`Next.js error: ${data}`));

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
