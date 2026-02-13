import "./FolderButton.css";
import { Node } from "../_lib/dataModel.ts";
import {CSSProperties} from "react";
import {motion} from "framer-motion";

interface FolderButtonProps {
    node?: Node;
    onClick?: () => void;
    className?: string;
    style?: CSSProperties;
}

const FolderButton = (props: FolderButtonProps) => {

    // Spacer only
    if (!props.node) return <div
        className={props.className}
        style={{ opacity: 0, pointerEvents: 'none' }}
    />


    let text: string = props.node.name;
    let delayAppear = 0;

    // Special stuff for top page
    if (text === "Native") {
        text = `Year-Round Residents`;
        delayAppear = 1;
    }
    if (text === "Non-Native") {
        text = `Just Passing Through`;
        delayAppear = 2;
    }
    if (text === "Invasive") {
        text = `I Don't Belong Here`;
        delayAppear = 3;
    }

    return (
        <motion.div
            className={props.className + ' rounded'}
            onClick={props.onClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: props.style?.opacity ?? 1 }}
            transition={{ delay: delayAppear * 0.75, duration: 0.5 }}
        >
            <div className="folder-button-contents">{text}</div>
        </motion.div>
    );
};

export default FolderButton;
