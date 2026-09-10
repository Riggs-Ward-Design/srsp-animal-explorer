/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

/**
 * What the preload puts on the window besides `ipcRenderer`. Optional because
 * anything running without an Electron main process won't have it.
 */
interface KioskBridge {
  /** Parsed config.yml. Untyped by design: shape is checked at the point of use. */
  appConfig: unknown
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
  kiosk?: KioskBridge
  versions: {
    chrome: string
  }
}
