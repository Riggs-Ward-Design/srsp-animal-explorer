import "./ExplorerButton.css";
import { Node } from "../_lib/dataModel.ts";
import {CSSProperties} from "react";

interface ExplorerButtonProps {
    node?: Node;
    onClick?: () => void;
    className?: string;
    style?: CSSProperties;
}

const ExplorerButton = (props: ExplorerButtonProps) => {

    // Spacer only
    if (!props.node) return <div
        className={props.className}
        style={{ opacity: 0, pointerEvents: 'none' }}
    />

    let text: string = props.node.name;
    if (text === "Native") text = `Year-Round Residents`;
    if (text === "Non-Native") text = `Just Passing Through`;
    if (text === "Invasive") text = `I Don't Belong Here`;

    return (
        <div
            className={props.className + ' rounded'}
            onClick={props.onClick}
            style={{
                ...props.style,
                opacity: props.onClick ? props.style?.opacity : 0,
                pointerEvents: props.onClick ? 'auto' : 'none'
            }}
        >
            <div className="explorer-button-contents">{text}</div>
        </div>
    );
};

export default ExplorerButton;
