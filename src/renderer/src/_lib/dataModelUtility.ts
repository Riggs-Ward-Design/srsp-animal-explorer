import type { FolderNode, Node } from './dataModel'

export function getNode(root: FolderNode, path: readonly string[]): Node | undefined {
  if (!path) return undefined

  let n: Node = root

  for (const seg of path) {
    if (n.nodeType !== 'folder') return undefined
    n = n.children[seg]
    if (!n) return undefined
  }

  return n
}

export function getChildren(folder: FolderNode): Node[] {
  return Object.values(folder.children)
}

export function getSiblingPath(
  root: FolderNode,
  p: readonly string[],
  dir: -1 | 1
): string[] | undefined {
  if (p.length === 0) return undefined

  const parentPath = getParentPath(p)
  const parent = getNode(root, parentPath)
  if (parent?.nodeType !== 'folder') return undefined

  const siblings = Object.keys(parent.children)
  const index = siblings.indexOf(p[p.length - 1])
  const nextIndex = index + dir

  if (nextIndex < 0 || nextIndex >= siblings.length) return undefined

  return [...parentPath, siblings[nextIndex]]
}

export function getParentPath(p: readonly string[]): string[] {
  if (p.length === 0) return [...p]
  return p.slice(0, -1)
}
