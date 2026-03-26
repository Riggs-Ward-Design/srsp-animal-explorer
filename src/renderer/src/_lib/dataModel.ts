import jsYaml from 'js-yaml'

export type TextEntry = {
  heading: string
  body: string
}

export type Item = {
  commonName: string
  scientificName: string
  texts: TextEntry[]
  localStatus: string
  order?: string
  family?: string
  align?: number
}

export type FolderNode = {
  nodeType: 'folder'
  name: string
  children: Record<string, Node>
}

export type ItemNode = {
  nodeType: 'item'
  name: string
  item: Item
}

export type Node = FolderNode | ItemNode

const createRoot = (): FolderNode => ({
  nodeType: 'folder',
  name: '__root__',
  children: {}
})

const compareNodes = (a: Node, b: Node) => {
  if (a.nodeType !== b.nodeType) {
    return a.nodeType === 'folder' ? -1 : 1
  }

  return 0
}

const rebuildChildrenSorted = (children: Record<string, Node>) => {
  const entries = Object.entries(children)
  entries.sort(([, a], [, b]) => compareNodes(a, b))

  const rebuilt: Record<string, Node> = {}
  for (const [k, v] of entries) {
    rebuilt[k] = v
  }

  return rebuilt
}

const setChildSorted = (parent: FolderNode, child: Node) => {
  parent.children[child.name] = child
  parent.children = rebuildChildrenSorted(parent.children)
}

const FOLDER_PREFIX = 'Folder!'

export class DataModel {
  public readonly content: FolderNode

  public static empty(): DataModel {
    return new DataModel(JSON.stringify(createRoot()))
  }

  public constructor(json: string) {
    this.content = JSON.parse(json) as FolderNode
  }

  public static fromYaml(yaml: string): DataModel {
    const doc = jsYaml.load(yaml) as YamlList | null
    if (!Array.isArray(doc)) return DataModel.empty()

    const root = createRoot()
    walkYamlList(root, doc, [])
    return new DataModel(JSON.stringify(root))
  }

  public getAllItemNames(): string[] {
    const names: string[] = []
    const walk = (node: Node): void => {
      if (node.nodeType === 'item') names.push(node.item.commonName)
      else Object.values(node.children).forEach(walk)
    }
    walk(this.content)
    return names
  }

  public static fromCsv(csv: string): DataModel {
    const rows = parseCsv(csv)
    if (rows.length === 0) return DataModel.empty()

    const rawHeaders = rows[0]

    const keyFor = (h: string) =>
      h
        .replace(/^\uFEFF/, '')
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, '-')

    const headers = rawHeaders.map(keyFor)
    const idx = (name: string) => headers.indexOf(name.toLowerCase())

    const iName = idx('common-name')
    const iSci = idx('scientific-name')
    const iStatus = idx('local-status')
    const iOrder = idx('order')
    const iFamily = idx('family')
    const iAlign = idx('align')

    // Collect all "Text N Heading" / "Text N Body" column index pairs (N = 1, 2, 3, …)
    const textPairs: { iHeading: number; iBody: number }[] = []
    for (let n = 1; ; n++) {
      const iHeading = idx(`text-${n}-heading`)
      const iBody = idx(`text-${n}-body`)
      if (iHeading === -1 && iBody === -1) break
      textPairs.push({ iHeading, iBody })
    }

    const root = createRoot()

    for (let r = 1; r < rows.length; r++) {
      const cells = rows[r]
      if (cells.length === 0) continue
      if (cells.every((c) => c.trim().length === 0)) continue

      const get = (i: number) => {
        if (i < 0) return ''
        return (cells[i] ?? '').trim().replace('/', '/\u200B')
      }

      const localStatus = get(iStatus)
      const order = get(iOrder)
      const name = get(iName)
      if (localStatus.length === 0 || name.length === 0) continue

      const texts = textPairs
        .map(({ iHeading, iBody }) => ({ heading: get(iHeading), body: get(iBody) }))
        .filter(({ heading, body }) => heading.length > 0 || body.length > 0)

      const rawAlign = parseFloat(get(iAlign))
      const align = isNaN(rawAlign) ? undefined : Math.max(0, Math.min(1, rawAlign))

      const item: Item = {
        commonName: name,
        scientificName: get(iSci),
        texts,
        localStatus,
        order,
        family: get(iFamily) || undefined,
        align
      }

      const path: string[] = [localStatus]
      if (order) path.push(order)
      if (item.family) path.push(item.family)

      const folder = ensureFolderAtPath(root, path)

      setChildSorted(folder, {
        nodeType: 'item',
        name: item.commonName,
        item
      })
    }

    return new DataModel(JSON.stringify(root))
  }

}

function ensureFolderAtPath(root: FolderNode, path: readonly string[]): FolderNode {
  let cur = root

  for (const key of path) {
    const existing = cur.children[key]
    if (existing?.nodeType === 'folder') {
      cur = existing
      continue
    }

    const created: FolderNode = { nodeType: 'folder', name: key, children: {} }
    setChildSorted(cur, created)
    cur = created
  }

  return cur
}

function parseCsv(csv: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i]

    if (inQuotes) {
      if (ch === '"') {
        const next = csv[i + 1]
        if (next === '"') {
          cell += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cell += ch
      }

      continue
    }

    if (ch === '"') {
      inQuotes = true
      continue
    }

    if (ch === ',') {
      row.push(cell)
      cell = ''
      continue
    }

    if (ch === '\n') {
      row.push(cell)
      cell = ''
      rows.push(row)
      row = []
      continue
    }

    if (ch === '\r') {
      continue
    }

    cell += ch
  }

  row.push(cell)
  rows.push(row)

  return rows
}

// ---------------------------------------------------------------------------
// YAML parsing helpers
// ---------------------------------------------------------------------------

type YamlEntry = Record<string, YamlList | null>
type YamlList = YamlEntry[]

function parseItemKey(key: string): { commonName: string; scientificName: string } {
  const match = key.match(/^(.+?)\s*\(([^)]+)\)\s*$/)
  if (match) return { commonName: match[1].trim(), scientificName: match[2].trim() }
  return { commonName: key.trim(), scientificName: '' }
}

function walkYamlList(
  parent: FolderNode,
  list: YamlList,
  folderPath: string[]
): void {
  for (const entry of list) {
    const key = Object.keys(entry)[0]
    const children = entry[key]

    if (key.startsWith(FOLDER_PREFIX)) {
      const folderName = key.slice(FOLDER_PREFIX.length)
      const folder = ensureFolderAtPath(parent, [folderName])
      walkYamlList(folder, children ?? [], [...folderPath, folderName])
    } else {
      const { commonName, scientificName } = parseItemKey(key)
      if (!commonName) continue

      const texts: TextEntry[] = []
      let align: number | undefined

      if (Array.isArray(children)) {
        for (const child of children) {
          const childKey = Object.keys(child)[0]
          if (childKey === 'settings') {
            const settings = child[childKey] as YamlList | null
            if (Array.isArray(settings)) {
              for (const s of settings) {
                if ('align' in s) {
                  const raw = parseFloat(String(s['align']))
                  if (!isNaN(raw)) align = Math.max(0, Math.min(1, raw))
                }
              }
            }
          } else {
            const body = String(child[childKey] ?? '').replace('/', '/\u200B')
            texts.push({ heading: childKey, body })
          }
        }
      }

      const item: Item = {
        commonName,
        scientificName,
        texts,
        localStatus: folderPath[0] ?? '',
        order: folderPath[1],
        family: folderPath[2],
        align
      }

      setChildSorted(parent, {
        nodeType: 'item',
        name: item.commonName,
        item
      })
    }
  }
}
