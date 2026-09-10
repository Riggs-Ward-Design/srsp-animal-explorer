import { ipcRenderer, contextBridge } from 'electron'
import { APP_CONFIG_CHANNEL } from '../main/ipc'

// The operator's settings: inert read-only data, fetched synchronously so
// renderer modules have their settings at import time.
let appConfig: Record<string, unknown> = {}
try {
  appConfig = ipcRenderer.sendSync(APP_CONFIG_CHANNEL) ?? {}
} catch (err) {
  // The kiosk running on built-in defaults beats it not running.
  console.warn('[config] could not read config from the main process:', err)
}

contextBridge.exposeInMainWorld('kiosk', { appConfig })

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  }
})

contextBridge.exposeInMainWorld('versions', {
  chrome: process.versions.chrome
})
