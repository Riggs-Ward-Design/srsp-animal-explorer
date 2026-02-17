import { useCallback, useMemo, useState } from 'react'
import type { DataModel, FolderNode, Node } from './dataModel'

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

export function useDataModel(ctx: DataModel) {
  const [path, setPath] = useState<string[]>([])
  const [lastChildName, setLastChildName] = useState<string | undefined>(undefined)

  const node = useMemo<Node>(() => ctx.getNode(path) ?? ctx.content, [ctx, path])

  const parentPath = useMemo(() => (path.length === 0 ? [] : ctx.getParentPath(path)), [ctx, path])

  const parentNode = useMemo<FolderNode>(() => {
    if (node.nodeType === 'folder') return node

    const parent = ctx.getNode(parentPath)
    if (parent?.nodeType === 'folder') return parent

    return ctx.content
  }, [ctx, node, parentPath])

  const push = useCallback(
    (label: string) => {
      if (node.nodeType === 'folder') {
        setLastChildName(undefined)
        setPath((p) => [...p, label])
      }
    },
    [node]
  )

  const canGoUp = path.length > 0
  const canGoToPrev =
    node.nodeType === 'item' && ctx.getNode(ctx.getSiblingPath(path, -1)!)?.nodeType === 'item'
  const canGoToNext =
    node.nodeType === 'item' && ctx.getNode(ctx.getSiblingPath(path, 1)!)?.nodeType === 'item'

  const up = useCallback(() => {
    setPath((p) => {
      setLastChildName(p[p.length - 1])
      return ctx.getParentPath(p)
    })
  }, [ctx])
  const prev = useCallback(() => setPath((p) => ctx.getSiblingPath(p, -1) ?? p), [ctx])
  const next = useCallback(() => setPath((p) => ctx.getSiblingPath(p, 1) ?? p), [ctx])

  return {
    path,
    node,
    parentNode,
    lastChildName,
    setPath,
    push,
    canGoUp,
    canGoToPrev,
    canGoToNext,
    up,
    prev,
    next
  }
}
