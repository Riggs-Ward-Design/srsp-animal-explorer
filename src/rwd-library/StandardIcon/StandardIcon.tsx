/**
 * QuickIcon component renders an SVG icon based on a predefined set of paths.
 *
 * Props:
 * - `className` (string, optional): CSS class for styling the SVG element.
 * - `iconName` (IconName, optional): Name of the icon to render. Must match one of the names in `standard-icons.json`.
 * - `iconStyle` ("filled" | "outlined", optional): Style of the icon. Defaults to `"filled"`.
 * - `customPath` (string, optional): If provided, overrides the default icon path with a custom SVG path.
 *
 * The component uses a lookup table (`PATHS`) derived from `standard-icons.json` to render the correct SVG path.
 * If `customPath` is provided, it takes precedence over `iconName` and `iconStyle`.
 */

import icons from "./standard-icons.json"

export type IconName =
      "home"
    | "left-chevron"
    | "right-chevron"
    | "left-arrow"
    | "right-arrow"
    | "expand"
    | "collapse"
    | "close"
    | "menu"
    | "search"
    | "settings"
    | "zoom-in"
    | "zoom-out"
    | "play"
    | "pause"
    | "volume"
    | "mute"
    | "captions-on"
    | "captions-off"
    | "help"

export type IconStyle =
      'filled'
    | 'outlined'

const ICONS = icons as {
    name: string;
    filledPath: string;
    outlinedPath: string
}[]

const PATHS = ICONS.reduce<Record<string, { filled: string; outlined: string }>>((acc, i) => {
    acc[i.name] = { filled: i.filledPath, outlined: i.outlinedPath }
    return acc
}, {})

interface QuickIconProps {
    className?: string
    iconName?: IconName
    iconStyle?: IconStyle
    customPath?: string
}

const StandardIcon = ({ className, iconName, iconStyle = "filled", customPath }: QuickIconProps) => {

    let d: string;
    if (customPath) d = customPath;
    else {
        if (!iconName) return null;
        switch (iconStyle) {
            case "outlined":
                d = PATHS[iconName].outlined;
                break;
            default:
                d = PATHS[iconName].filled;
                break;
        }
    }

    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path d={d} />
        </svg>
    )
}

export default StandardIcon
