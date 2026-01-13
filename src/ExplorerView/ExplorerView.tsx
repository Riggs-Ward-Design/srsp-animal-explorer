import './ExplorerView.css';
import NavBar from "../NavBar/NavBar.tsx";
import FolderButton from "../FolderButton/FolderButton.tsx";
import contentCSV from "../_assets/srsp animal facts.csv?raw";
import { useMemo } from "react";
import { DataContext } from "../_lib/dataContext";
import { useDataExplorer } from "../_lib/useDataExplorer";

const ExplorerView = () => {

    const dataContext = useMemo(() => DataContext.fromCsv(contentCSV), []);

    const {
        path,
        entries,
        canGoUp,
        canGoToPrev,
        canGoToNext,
        push,
        up,
        prev,
        next
    } = useDataExplorer(dataContext);

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

                <h1>{getFolderLabel(path)}</h1>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px'
                }}>
                    {entries.map(e => (
                        <FolderButton
                            key={e.label}
                            label={e.label}
                            onClick={() => {
                                if (e.kind === "folder") {
                                    push(e.label);
                                }
                            }}
                        />
                    ))}
                </div>
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
