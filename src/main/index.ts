import { app, BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'node:path'

let win: BrowserWindow | null

function quitOnEscapeInput(_: Electron.Event, input: Electron.Input): void {
  if (input.key === 'Escape') app.quit()
}

function createWindow(): void {
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: !is.dev,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      backgroundThrottling: false
    }
  })

  win.webContents.on('before-input-event', quitOnEscapeInput)

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL']).then()
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html')).then()
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.whenReady().then(createWindow)
