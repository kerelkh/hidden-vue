import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { autoUpdater } from 'update-electron-app'

// Enable auto-updates via update.electronjs.org
autoUpdater()

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'Hidden Monitoring',
    icon: join(__dirname, '../public/favicon.svg')
  })

  // Load the Vite built index.html
  win.loadFile(join(__dirname, '../dist/index.html'))

  // Open DevTools in development
  // win.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})