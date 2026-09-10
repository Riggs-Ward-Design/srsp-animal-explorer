# srsp-animal-explorer

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
# fullscreen, the way the kiosk runs
$ npm run dev

# half-resolution window, for working alongside an editor
$ npm run dev:window
```

Both run the same layout: the window's zoom factor scales the UI from its
3840x2160 base resolution, so the windowed session is a faithful miniature
rather than a different layout. The base resolution and the windowed fraction
are in `src/main/uiScale.ts`.

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## Settings (`config.yml`)

A handful of values are read at startup from `config.yml` rather than compiled
in, so they can be changed on the installed kiosk without a rebuild. On the
installed machine the file sits **beside the executable**; it's authored at the
project root and staged into `dist/` during packaging. In dev, the project root
copy is the one being read. Edit it, restart the app.

Each setting takes either one value, or a `build:`/`dev:` pair:

```yaml
display:              # monitor to open on, 0-based; -1 leaves it to the OS
  build: -1
  dev: -1

timeToIdle:           # seconds of inactivity before a quadrant goes idle
  build: 60
  dev: 10

quadMode: true        # 2x2 grid of instances, or a single full-screen one
```

`build` is what ships; `dev` is what `npm run dev` runs on. A single value means
that value for both. Packaging flattens every setting to its build value, so the
file staged into `dist/` is a flat list of scalars with no pair machinery in it,
and a dev-only tweak left in place can't ride along into a release. That
flattening is `scripts/flattenConfig.mjs`, run by `scripts/stageConfig.mjs`.

`display` indexes the monitors in the order the OS reports them — one less than
the number Windows shows in its display settings pane. Leave it at `-1` (or
delete the line) unless the kiosk opens on the wrong monitor. An index with no
monitor attached falls back to the default display. It's read in the main
process only, so unlike the settings below it never reaches `useConfig()`.

Renderer settings are read through `useConfig()`, whose fallback argument is
both the default and the expected type:

```ts
const timeout = useConfig().get('timeToIdle', 60)
```

A value of the wrong type warns and takes the fallback, so one bad line costs
one setting rather than the whole file.
