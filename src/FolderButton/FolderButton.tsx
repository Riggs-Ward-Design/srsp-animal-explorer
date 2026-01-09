import './FolderButton.css'

interface FolderButtonProps {
    label: string;
    onClick: () => void;
}

const FolderButton = (props: FolderButtonProps) => {

    // Custom labels at the top levels
    let label: string = props.label;
    if (label === 'Native') label = `Year-Round Residents`;
    if (label === 'Non-Native') label = `Just Passing Through`;
    if (label === 'Invasive') label = `I Don't Belong Here`;

    return (

        <div className='folder-button' onClick={props.onClick}>
            {label}
        </div>
    );
};

export default FolderButton;