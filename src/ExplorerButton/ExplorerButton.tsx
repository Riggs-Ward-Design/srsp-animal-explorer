import "./ExplorerButton.css";
import BitmapToCanvas from "../BitmapToCanvas/BitmapToCanvas.tsx";

interface FolderButtonProps {
    label?: string;
    bitmap?: ImageBitmap;
    onClick?: () => void;
}

const ExplorerButton = (props: FolderButtonProps) => {
    let text: string | undefined = props.label;
    if (text === "Native") text = `Year-Round Residents`;
    if (text === "Non-Native") text = `Just Passing Through`;
    if (text === "Invasive") text = `I Don't Belong Here`;

    if (props.bitmap) {
        return (
            <div className="explorer-button rounded" onClick={props.onClick}>
                <BitmapToCanvas bitmap={props.bitmap} />
            </div>
        );
    }

    return (
        <div
            className="explorer-button rounded"
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
