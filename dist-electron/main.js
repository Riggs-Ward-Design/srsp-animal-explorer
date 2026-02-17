import { app as o, BrowserWindow as i } from "electron";
import { fileURLToPath as a } from "node:url";
import n from "node:path";
const s = n.dirname(a(import.meta.url));
process.env.APP_ROOT = n.join(s, "..");
const t = process.env.VITE_DEV_SERVER_URL, m = n.join(process.env.APP_ROOT, "dist-electron"), r = n.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = t ? n.join(process.env.APP_ROOT, "public") : r;
let e;
function p(d, l) {
  l.key === "Escape" && o.quit();
}
function c() {
  e = new i({
    width: 1920,
    height: 1080,
    icon: n.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    fullscreen: !t,
    // windowed in dev, fullscreen in build
    webPreferences: {
      preload: n.join(s, "../preload.mjs"),
      backgroundThrottling: !1
    }
  }), e.webContents.on("before-input-event", p), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), t ? e.loadURL(t).then() : e.loadFile(n.join(r, "index.html")).then();
}
o.on("window-all-closed", () => {
  process.platform !== "darwin" && (o.quit(), e = null);
});
o.on("activate", () => {
  i.getAllWindows().length === 0 && c();
});
o.whenReady().then(c);
export {
  m as MAIN_DIST,
  r as RENDERER_DIST,
  t as VITE_DEV_SERVER_URL
};
