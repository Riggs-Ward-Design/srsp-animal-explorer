import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'node:path'
import { loadAppConfig } from './appConfig'
import { displayIndex, windowPosition } from './display'
import { baseResolution, fitZoomFactor, windowedSize } from './uiScale'
import { APP_CONFIG_CHANNEL } from './ipc'

// Set KIOSK_WINDOWED=1 to run a half-resolution window. Development only:
// gating the kiosk lock on `is.dev` alone means a stray env var on a deployed
// machine can't leave a kiosk unlocked.
const windowed = process.env.KIOSK_WINDOWED === '1'

const windowSize = windowed ? windowedSize() : { width: baseResolution.x, height: baseResolution.y }

let win: BrowserWindow | null

// Read once, at startup. Not watched: a setting that can move mid-session is
// one every consumer has to react to. Edit the file, restart the app.
let appConfig: Record<string, unknown> = {}

function quitOnEscapeInput(_: Electron.Event, input: Electron.Input): void {
  if (input.key === 'Escape') app.quit()
}

/**
 * The position that puts the window on the configured display, or nothing at
 * all when the setting is absent — an omitted x/y is what lets Electron pick.
 */
function configuredPosition(): { x: number; y: number } | undefined {
  const displays = screen.getAllDisplays()
  const index = displayIndex(appConfig.display, displays.length)
  if (index === null) return undefined
  return windowPosition(displays[index].bounds, windowSize)
}

function createWindow(): void {
  win = new BrowserWindow({
    ...windowSize,
    ...configuredPosition(),
    // Size the content area: with the default, the titlebar eats into the
    // height and leaves the UI off the base aspect ratio.
    useContentSize: true,
    backgroundColor: '#000000',
    ...(is.dev ? { fullscreen: !windowed } : { kiosk: true }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      backgroundThrottling: false
    }
  })

  const contents = win.webContents

  // Scales the authored-at-base-resolution UI to whatever the window actually
  // is, so a half-size window and a 1080p panel show the same layout.
  const rescale = (): void => {
    if (!win || win.isDestroyed()) return
    const [contentWidth, contentHeight] = win.getContentSize()
    // A minimized window reports a degenerate size; leave the last layout be.
    if (contentWidth <= 0 || contentHeight <= 0) return

    const zoomFactor = fitZoomFactor(contentWidth, contentHeight)
    contents.setZoomFactor(zoomFactor)

    if (is.dev) {
      console.log(
        `[kiosk] content ${contentWidth}x${contentHeight} @ zoom ${zoomFactor.toFixed(4)}`
      )
    }
  }

  // 'resize', not 'resized', so the UI tracks a drag. Not windowed-only: a
  // fullscreen window resizes too when its display changes resolution.
  win.on('resize', rescale)

  // Keeps a dev window a faithful miniature of the kiosk.
  if (windowed) win.setAspectRatio(windowSize.width / windowSize.height)

  win.webContents.on('before-input-event', quitOnEscapeInput)

  win.webContents.on('did-finish-load', () => {
    // Pinch-to-zoom is a compositor gesture, independent of the zoom factor set
    // for UI scaling; pinning the visual limits leaves that intact.
    contents.setVisualZoomLevelLimits(1, 1)
    rescale()
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

app.whenReady().then(() => {
  appConfig = loadAppConfig(is.dev, app.getPath('exe'), process.cwd())
  ipcMain.on(APP_CONFIG_CHANNEL, (event) => {
    event.returnValue = appConfig
  })

  createWindow()
})
