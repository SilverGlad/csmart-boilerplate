const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const { ipcMain } = require('electron');


db.close();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));
  }

   // Abre as ferramentas de desenvolvedor
}

app.on('ready', () => {
  createWindow();
  const db = new sqlite3.Database('./database.db');
  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INT, name TEXT)");
  });

  db.serialize(() => {
    const stmt = db.prepare("INSERT INTO users VALUES (?, ?)");
    stmt.run(1, "Nicolas Lima");
    stmt.finalize();
  });
  
  ipcMain.on('fetch-users', (event, arg) => {
    db.all("SELECT id, name FROM users", [], (err, rows) => {
      if (err) {
        throw err;
      }
      event.reply('fetch-users-reply', rows);
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


ipcMain.on('fetch-users', (event, arg) => {
  const db = new sqlite3.Database('./database.db');
  db.all("SELECT id, name FROM users", [], (err, rows) => {
    if (err) {
      throw err;
    }
    event.reply('fetch-users-reply', rows);
  });
  db.close();
});

