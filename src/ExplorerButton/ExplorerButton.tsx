import './ExplorerButton.css'

interface FolderButtonProps {
    label?: string;
    image?: string;
    onClick: () => void;
}

const ExplorerButton = (props: FolderButtonProps) => {

    // Custom labels at the top levels
    let text: string | undefined = props.label;
    if (text === 'Native') text = `Year-Round Residents`;
    if (text === 'Non-Native') text = `Just Passing Through`;
    if (text === 'Invasive') text = `I Don't Belong Here`;

    // Item button
    if (props.image) return (
        <div className='explorer-button' onClick={props.onClick}>
            <img src={props.image} />
        </div>
    );

    // Folder button
    return (
        <div className='explorer-button' onClick={props.onClick}>
            <div className={'explorer-button-contents'}>
                {text}
            </div>
        </div>
    );
};

export default ExplorerButton;