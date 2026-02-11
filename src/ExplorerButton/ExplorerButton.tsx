import "./ExplorerButton.css";
import { Node } from "../_lib/dataContext.ts";

interface ExplorerButtonProps {
    node?: Node;
    onClick?: () => void;
    className?: string;
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
                opacity: props.onClick ? 1 : 0,
                pointerEvents: props.onClick ? 'auto' : 'none'
            }}
        >
            <div className="explorer-button-contents">{text}</div>
        </div>
    );
};

export default ExplorerButton;
