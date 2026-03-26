import { app, BrowserWindow } from "electron";
import { is } from "@electron-toolkit/utils";
import { join } from "node:path";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
let win;
function quitOnEscapeInput(_, input) {
  if (input.key === "Escape") app.quit();
}
function createWindow() {
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    kiosk: !is.dev,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      backgroundThrottling: false
    }
  });
  win.webContents.on("before-input-event", quitOnEscapeInput);
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"]).then();
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html")).then();
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
app.whenReady().then(createWindow);
