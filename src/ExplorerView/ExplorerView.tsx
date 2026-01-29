import './ExplorerView.css';
import NavBar from "../NavBar/NavBar.tsx";
import contentCSV from "../_assets/srsp animal facts.csv?raw";
import { useMemo } from "react";
import { DataContext } from "../_lib/dataContext";
import { useDataContext } from "../_lib/useDataContext.ts";
import ExplorerButtonCarousel from "../ExplorerButtonCarousel/ExplorerButtonCarousel.tsx";
import ItemView from "../ItemView/ItemView.tsx";

const ExplorerView = () => {

    const dataContext = useMemo(() => DataContext.fromCsv(contentCSV), []);

    const {
        path,
        node,
        entries,
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

                {(() => {
                    switch (node.nodeType) {

                        case "folder":
                            return <>
                                <h1>{getFolderLabel(path)}</h1>
                                <ExplorerButtonCarousel entries={entries} push={push} />
                            </>;

                        case "item":
                            return <ItemView item={node.item} />;
                    }
                })()}

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
