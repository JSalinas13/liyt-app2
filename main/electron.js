import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { startServer } from './server.js';

// Estas dos líneas reemplazan a __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    win.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow, startServer());

// Cierra la app cuando se cierran todas las ventanas (excepto en macOS)
app.on('window-all-closed', () => {
    console.log("__dirname", __dirname);
    console.log(process.platform);
    app.quit();
    //if (process.platform !== 'darwin') app.quit();
});
