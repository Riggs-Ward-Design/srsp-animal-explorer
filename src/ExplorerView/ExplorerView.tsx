import './ExplorerView.css';
import NavBar from "../NavBar/NavBar.tsx";
import contentCSV from "../_assets/srsp animal facts.csv?raw";
import { useMemo } from "react";
import { DataModel, FolderNode, ItemNode } from "../_lib/dataModel.ts";
import { useDataModel } from "../_lib/useDataModel.ts";
import ExplorerButtonCarousel from "../ExplorerButtonCarousel/ExplorerButtonCarousel.tsx";
import DirectionalTransitions from "../rwd-library/DirectionalTransitions/DirectionalTransitions.tsx";

interface ExplorerViewProps {
    onReset?: () => void;
}

const ExplorerView = (props: ExplorerViewProps) => {

    const dataModel = useMemo(() => DataModel.fromCsv(contentCSV), []);

    const {
        path,
        node,
        parentNode,
        push,
        canGoUp, canGoToPrev, canGoToNext,
        up, prev, next
    } = useDataModel(dataModel);

    const getFolderLabel = (p: string[]) => {
        if (p.length === 0) return 'Who Lives Here?';
        if (p.length === 1) {
            if (p[0] === 'Native') return `Learn About Year-Round Residents`;
            return `Learn About ${p[0]} Species`;
        }
        return `${p[0]} ${p[p.length - 1]}`;
    };

    const pathForCarousel = node.nodeType == 'folder' ? path : dataModel.getParentPath(path);

    return (
        <div className='explorer-view'>

            <div className='explorer-content'>
                <DirectionalTransitions currentPosition={{ x: 0, y: 0, z: pathForCarousel.length }} options={{ duration: 0.35 }}>
                    <ExplorerButtonCarousel
                        entries={dataModel.getChildren(node.nodeType === 'folder' ? node : parentNode)}
                        openFolderNode={dataModel.getNode(pathForCarousel) as FolderNode}
                        openItemNode={node.nodeType === 'item' ? node as ItemNode : undefined}
                        title={getFolderLabel(pathForCarousel)}
                        push={push}
                    />
                </DirectionalTransitions>
            </div>

            <NavBar
                upLabel={canGoUp ? getFolderLabel(dataModel.getParentPath(path)) : undefined}
                onMoveUp={canGoUp ? up : undefined}
                onMoveBack={canGoToPrev ? prev : undefined}
                onMoveNext={canGoToNext ? next : undefined}
                onReset={props.onReset}
            />

        </div>
    );
};

export default ExplorerView;
