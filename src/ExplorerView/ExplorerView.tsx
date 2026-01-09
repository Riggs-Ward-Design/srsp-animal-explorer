import './ExplorerView.css';
import NavBar from "../NavBar/NavBar.tsx";
import FolderButton from "../FolderButton/FolderButton.tsx";
import contentJson from "../_assets/content.json";
import { useMemo, useState } from "react";

const ExplorerView = () => {

    type Item = { name: string };
    type Content = Record<string, Record<string, Item[]>>;

    const content = contentJson as unknown as Content;

    type Node = Record<string, Node> | Item[];

    const root = content as unknown as Node;

    const [path, setPath] = useState<string[]>([]);

    const node = useMemo(() => {
        let n: Node = root;

        for (const key of path) {
            if (Array.isArray(n)) {
                return n;
            }

            n = n[key];
        }

        return n;
    }, [root, path]);

    const currentNodeContents: string[] = useMemo(() => {
        if (Array.isArray(node)) {
            return node.map(a => a.name);
        }

        return Object.keys(node);
    }, [node]);

    const getFolderLabel = (p: string[]) => {
        if (p.length === 0) return 'Who Lives Here?';
        if (p.length === 1) {
            if (p[0] === 'Native') return `Learn About Year-Round Residents`;
            return `Learn About ${p[0]} Species`;
        }
        return `${p[0]} ${p[p.length - 1]}`;
    }

    const isPathFirstSibling = (p: string[]) => {
        if (p.length === 1) {
            const siblings = Object.keys(content);
            return siblings.indexOf(p[0]) <= 0;
        }

        if (p.length === 2) {
            const [group, category] = p;
            const siblings = Object.keys(content[group]);
            return siblings.indexOf(category) <= 0;
        }

        return true;
    };

    const isPathLastSibling = (p: string[]) => {
        if (p.length === 1) {
            const siblings = Object.keys(content);
            const index = siblings.indexOf(p[0]);
            return index === siblings.length - 1;
        }

        if (p.length === 2) {
            const [group, category] = p;
            const siblings = Object.keys(content[group]);
            const index = siblings.indexOf(category);
            return index === siblings.length - 1;
        }

        return true;
    };

    const getSiblingPath = (p: string[], dir: -1 | 1) => {
        if (p.length === 1) {
            const siblings = Object.keys(content);
            const index = siblings.indexOf(p[0]);
            const nextIndex = index + dir;

            if (nextIndex < 0 || nextIndex >= siblings.length) return p;

            return [siblings[nextIndex]];
        }

        if (p.length === 2) {
            const [group, category] = p;
            const siblings = Object.keys(content[group]);
            const index = siblings.indexOf(category);
            const nextIndex = index + dir;

            if (nextIndex < 0 || nextIndex >= siblings.length) return p;

            return [group, siblings[nextIndex]];
        }

        return p;
    };

    const getParentPath = (p: string[]) => {
        if (p.length === 0) return p;
        return p.slice(0, -1);
    }

    return (
        <div className='explorer-view'>
            <div className='explorer-content'>

                <div style={{ marginBottom: '16px' }}>
                    {getFolderLabel(path)}
                </div>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px'
                }}>
                    {currentNodeContents.map(item => (
                        <FolderButton
                            key={item}
                            label={item}
                            onClick={() => {
                                if (!Array.isArray(node)) {
                                    setPath(p => [...p, item]);
                                }
                            }}
                        />
                    ))}
                </div>
            </div>

            <NavBar
                upLabel={path.length > 0 ? getFolderLabel(getParentPath(path)) : undefined}
                onMoveUp={path.length > 0 ? (() => setPath(p => getParentPath(p))) : undefined}
                onMoveBack={!isPathFirstSibling(path) ? () => setPath(p => getSiblingPath(p, -1)) : undefined}
                onMoveNext={!isPathLastSibling(path) ? () => setPath(p => getSiblingPath(p, 1)) : undefined}
            />

        </div>
    );
};

export default ExplorerView;
