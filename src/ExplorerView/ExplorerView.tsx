import './ExplorerView.css';
import NavBar from "../NavBar/NavBar.tsx";
import contentCSV from "../_assets/srsp animal facts.csv?raw";
import { useMemo } from "react";
import {DataContext, ItemNode} from "../_lib/dataContext";
import { useDataContext } from "../_lib/useDataContext.ts";
import ExplorerButtonCarousel from "../ExplorerButtonCarousel/ExplorerButtonCarousel.tsx";

const ExplorerView = () => {

    const dataContext = useMemo(() => DataContext.fromCsv(contentCSV), []);

    const {
        path,
        node,
        parentNode,
        push,
        canGoUp, canGoToPrev, canGoToNext,
        up, prev, next
    } = useDataContext(dataContext);

    const getFolderLabel = (p: string[]) => {
        if (p.length === 0) return 'Who Lives Here?';
        if (p.length === 1) {
            if (p[0] === 'Native') return `Learn About Year-Round Residents`;
            return `Learn About ${p[0]} Species`;
        }
        return `${p[0]} ${p[p.length - 1]}`;
    };

    return (
        <div className='explorer-view'>

            <div className='explorer-content'>
                <ExplorerButtonCarousel
                    entries={dataContext.getChildrenSorted(node.nodeType === 'folder' ? node : parentNode)}
                    openItemNode={node.nodeType === 'item' ? node as ItemNode : undefined}
                    title={getFolderLabel(node.nodeType == 'folder' ? path : dataContext.getParentPath(path))}
                    push={push}
                />
            </div>

            <NavBar
                upLabel={canGoUp ? getFolderLabel(dataContext.getParentPath(path)) : undefined}
                onMoveUp={canGoUp ? up : undefined}
                onMoveBack={canGoToPrev ? prev : undefined}
                onMoveNext={canGoToNext ? next : undefined}
            />

        </div>
    );
};

export default ExplorerView;
