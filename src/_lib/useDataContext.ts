import { useCallback, useMemo, useState } from "react";
import type {DataContext, Node, Item, FolderNode} from "./dataContext";

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

export type ExplorerEntry =
    | { kind: "folder"; name: string }
    | { kind: "item"; name: string; item: Item };

function isFolderNode(node: Node): node is FolderNode {
    return node.nodeType === "folder";
}

export function useDataContext(ctx: DataContext) {
    const [path, setPath] = useState<string[]>([]);

    const node = useMemo<Node>(() => ctx.getNode(path) ?? ctx.content, [ctx, path]);

    const entries = useMemo<ExplorerEntry[]>(() => {

        if (!isFolderNode(node)) return [{kind: "item", name: node.item.name, item: node.item}];

        const folderEntries = Object.keys(node.children).map((k) => ({
            name: k,
            kind: "folder" as const
        }));

        const itemEntries = node.items.map((i) => ({
            name: i.name,
            kind: "item" as const,
            item: i
        }));

        return [...folderEntries, ...itemEntries];
    }, [node]);

    const push = useCallback((label: string) => {
        if (isFolderNode(node)) setPath(p => [...p, label]);
    }, [node]);

    const canGoUp = path.length > 0;
    const canGoToPrev = !ctx.isPathFirstSibling(path);
    const canGoToNext = !ctx.isPathLastSibling(path);

    const up = useCallback(() => setPath(p => ctx.getParentPath(p)), [ctx]);
    const prev = useCallback(() => setPath(p => ctx.getSiblingPath(p, -1)), [ctx]);
    const next = useCallback(() => setPath(p => ctx.getSiblingPath(p, 1)), [ctx]);

    return {
        path,
        node,
        entries,
        setPath,
        push,
        canGoUp,
        canGoToPrev,
        canGoToNext,
        up,
        prev,
        next,
    };
}
