import React from "react";
import StandardIcon, {IconName, IconStyle} from "../StandardIcon/StandardIcon";
import "./StandardIconButton.css";

export interface ButtonProps {
    iconName: IconName
    label?: string
    onClick: React.MouseEventHandler<HTMLDivElement>
    className?: string
    style?: React.CSSProperties;
    iconStyle?: IconStyle
}

/**
 * Button component that renders a StandardIcon and optional label.
 *
 * Props:
 * - `iconName` (IconName, optional): Name of the icon to display inside the button.
 * - `label` (string, optional) Content for the button label.
 * - `onClick` (() => void): Function to be called when the button is clicked.
 * - `className` (string, optional): CSS class for styling the button. Defaults to `"button"`.
 * - `style` (React.CSSProperties, optional): Inline styles for the button.
 * - `iconStyle` (IconStyle, optional): Style of the icon.
 */

const StandardIconButton = (props: ButtonProps) =>
    <div
        className={"standard-icon-button"}
        onClick={props.onClick}
        style={props.style}
    >
        {props.iconName && <StandardIcon iconName={props.iconName} iconStyle={props.iconStyle}/>}
        {props.label}
    </div>

StandardIconButton.defaultProps = {
    className: "standard-icon-button"
}

export default StandardIconButton