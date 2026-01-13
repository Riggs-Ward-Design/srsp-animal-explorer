import { useCallback, useMemo, useState } from "react";
import type { DataContext, Node, Item } from "./dataContext";

/*

Description of things:

path
- string[]. The current location in the content tree.
- [] = root, ['Birds'] = inside Birds, ['Birds', 'Raptors'] = inside Birds → Raptors.

entries
- An array describing what’s visible at the current path.
- At a folder level, these are child folders.
- At a leaf level, these are items derived from Item.name.

canGoUp
- boolean. True when path.length > 0.
- Controls whether “up” navigation is enabled.

canGoToPrev
- boolean. True when the current path is not the first sibling at its level.
- Back/left navigation guard.

canGoToNext
- boolean. True when the current path is not the last sibling at its level.
- Next/right navigation guard.

push(label)
- Moves deeper into the tree by appending a key to path.
- No-op if the current node is a leaf (Item[]).

up()
- Moves one level up the tree by removing the last segment of path.

prev()
- Moves to the previous sibling at the current depth.
- Path length stays the same.

next()
- Moves to the next sibling at the current depth.
- Path length stays the same.

 */

export type ExplorerEntry = {
    label: string;
    kind: "folder" | "item";
};

export function useDataExplorer(ctx: DataContext) {
    const root = useMemo(() => ctx.content as unknown as Node, [ctx]);

    const [path, setPath] = useState<string[]>([]);

    const node = useMemo(() => {
        let n: Node = root;

        for (const key of path) {
            if (Array.isArray(n)) return n;
            n = n[key];
        }

        return n;
    }, [root, path]);

    const entries = useMemo<ExplorerEntry[]>(() => {
        if (Array.isArray(node)) {
            return (node as Item[]).map(i => ({ label: i.name, kind: "item" }));
        }

        return Object.keys(node).map(k => ({ label: k, kind: "folder" }));
    }, [node]);

    const canUp = path.length > 0;
    const canBack = !ctx.isPathFirstSibling(path);
    const canNext = !ctx.isPathLastSibling(path);

    const push = useCallback((label: string) => {
        if (Array.isArray(node)) return;
        setPath(p => [...p, label]);
    }, [node]);

    const up = useCallback(() => {
        setPath(p => ctx.getParentPath(p));
    }, [ctx]);

    const back = useCallback(() => {
        setPath(p => ctx.getSiblingPath(p, -1));
    }, [ctx]);

    const next = useCallback(() => {
        setPath(p => ctx.getSiblingPath(p, 1));
    }, [ctx]);

    return {
        path,
        node,
        entries,
        setPath,

        canGoUp: canUp,
        canGoToPrev: canBack,
        canGoToNext: canNext,

        push,
        up,
        prev: back,
        next,
    };
}
