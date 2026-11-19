import { useCallback, useMemo, useState } from 'react'
import type { DataModel, FolderNode, Node } from './dataModel'
import { getNode, getParentPath, getSiblingPath } from './dataModelUtility'

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

const validPrefix = (root: FolderNode, p: readonly string[]): string[] => {
  const valid: string[] = []
  let n: Node = root
  for (const seg of p) {
    if (n.nodeType !== 'folder' || !n.children[seg]) break
    n = n.children[seg]
    valid.push(seg)
  }
  return valid
}

export function useDataModel(ctx: DataModel) {
  const [path, setPath] = useState<string[]>([])
  const [lastChildName, setLastChildName] = useState<string | undefined>(undefined)
  const [prevCtx, setPrevCtx] = useState(ctx)

  if (prevCtx !== ctx) {
    setPrevCtx(ctx)
    setPath((p) => validPrefix(ctx.content, p))
  }

  const node = useMemo<Node>(() => getNode(ctx.content, path) ?? ctx.content, [ctx, path])

  const parentPath = useMemo(() => (path.length === 0 ? [] : getParentPath(path)), [ctx, path])

  const parentNode = useMemo<FolderNode>(() => {
    if (node.nodeType === 'folder') return node

    const parent = getNode(ctx.content, parentPath)
    if (parent?.nodeType === 'folder') return parent

    return ctx.content
  }, [ctx, node, parentPath])

  // A push is only valid against the path it was rendered for. If the path has already moved
  // (a second tap in the same frame, or a tap on a stale panel), the path is left unchanged.
  const push = useCallback(
    (label: string) => {
      const folder = getNode(ctx.content, path)
      if (folder?.nodeType !== 'folder' || !folder.children[label]) {
        console.warn('push rejected: not a child of the current folder', { path, label })
        return
      }
      setPath((p) => {
        if (p !== path) {
          console.warn('push rejected: path changed before it applied', {
            from: path,
            now: p,
            label
          })
          return p
        }
        return [...path, label]
      })
      setLastChildName(undefined)
    },
    [ctx, path]
  )

  const canGoUp = path.length > 0
  const canGoToPrev =
    node.nodeType === 'item' &&
    getNode(ctx.content, getSiblingPath(ctx.content, path, -1)!)?.nodeType === 'item'
  const canGoToNext =
    node.nodeType === 'item' &&
    getNode(ctx.content, getSiblingPath(ctx.content, path, 1)!)?.nodeType === 'item'

  const up = useCallback(() => {
    setPath((p) => {
      setLastChildName(p[p.length - 1])
      return getParentPath(p)
    })
  }, [ctx])
  const prev = useCallback(() => setPath((p) => getSiblingPath(ctx.content, p, -1) ?? p), [ctx])
  const next = useCallback(() => setPath((p) => getSiblingPath(ctx.content, p, 1) ?? p), [ctx])

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
