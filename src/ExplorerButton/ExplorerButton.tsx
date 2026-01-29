import "./ExplorerButton.css";
import { Node } from "../_lib/dataContext.ts";
import { kebabCase } from "change-case";
import { imageUrls } from "../_lib/assets.ts";

interface ExplorerButtonProps {
    node?: Node;
    onClick?: () => void;
}

const ExplorerButton = ({node, onClick}: ExplorerButtonProps) => {

    // Spacer only
    if (!node) return <div
        className="explorer-button rounded"
        style={{ opacity: 0, pointerEvents: 'none' }}
    />

    if (node.nodeType === 'item') {

        const getImageUrl = (name: string) => {
            const imageUrl = `../_assets/content-images/${kebabCase(name)}.jpeg`
            return imageUrls[imageUrl];
        }
        const url = getImageUrl(node.item.commonName);
        if (url) return (
            <div
                className="explorer-button rounded"
                onClick={onClick}
            >
                <img src={url} alt={node.item.commonName}/>
            </div>
        );
    }

    let text: string = node.name;
    if (text === "Native") text = `Year-Round Residents`;
    if (text === "Non-Native") text = `Just Passing Through`;
    if (text === "Invasive") text = `I Don't Belong Here`;

    return (
        <div
            className="explorer-button rounded"
            onClick={onClick}
            style={{
                opacity: onClick ? 1 : 0,
                pointerEvents: onClick ? 'auto' : 'none'
            }}
        >
            <div className="explorer-button-contents">{text}</div>
        </div>
    );
};

export default ExplorerButton;
