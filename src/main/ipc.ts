// Channel names shared between the main process and the preload bridge.
//
// No imports: the preload is a tiny script running in the renderer's process,
// and anything this module pulls in rides along into that bundle.

/** Synchronous request for the parsed contents of config.yml. */
export const APP_CONFIG_CHANNEL = 'app-config'
