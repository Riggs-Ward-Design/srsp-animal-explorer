import './ExplorerView.css';
import NavBar from "../NavBar/NavBar.tsx";
import ExplorerButton from "../ExplorerButton/ExplorerButton.tsx";
import contentCSV from "../_assets/srsp animal facts.csv?raw";
import { useMemo } from "react";
import { DataContext } from "../_lib/dataContext";
import { useDataExplorer } from "../_lib/useDataExplorer";
import { kebabCase } from "change-case"

const ExplorerView = () => {

    const dataContext = useMemo(() => DataContext.fromCsv(contentCSV), []);

    const images = import.meta.glob(
        "../_assets/content-images/*",
        { eager: true, import: "default" }
    ) as Record<string, string>;

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

    const getImage = (name: string) => {
        const imageUrl = `../_assets/content-images/${kebabCase(name)}.jpeg`
        return images[imageUrl];
    }

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
                        <ExplorerButton
                            key={e.name}
                            label={e.kind === "folder" ? e.name : !getImage(e.name) ? e.name : undefined}
                            image={e.kind === "item" ? getImage(e.name) : undefined}
                            onClick={() => {
                                e.kind === "folder"
                                    ? push(e.name)
                                    : console.log(e.name);
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
