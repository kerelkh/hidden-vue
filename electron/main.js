const { app, BrowserWindow } = require('electron')
const { updateElectronApp } = require('update-electron-app')
updateElectronApp()

const path = require('node:path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'Hidden Monitoring',
    icon: path.join(__dirname, '../public/favicon.svg')
  })

  // Load the Vite built index.html
  win.loadFile(path.join(__dirname, '../dist/index.html'))
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
