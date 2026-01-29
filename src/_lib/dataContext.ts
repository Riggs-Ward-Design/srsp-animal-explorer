export type Item = {
    name: string;
    scientificName?: string;
    habitat?: string;
    diet?: string;
    funFact?: string;
    localStatus: string;
    order: string;
    family?: string;
};

export type FolderNode = { nodeType: "folder"; children: Record<string, FolderNode>; items: Item[]; };
export type ItemNode = { nodeType: "item"; item: Item; };
export type Node = FolderNode | ItemNode;

export class DataContext {
    public readonly content: FolderNode;

    public static empty(): DataContext {
        return new DataContext(JSON.stringify({ nodeType: "folder", children: {}, items: [] } as FolderNode));
    }

    public constructor(json: string) {
        this.content = JSON.parse(json) as FolderNode;
    }

    public static fromCsv(csv: string): DataContext {

        const rows = parseCsv(csv);
        if (rows.length === 0) return DataContext.empty();

        const rawHeaders = rows[0];

        const keyFor = (h: string) =>
            h.replace(/^\uFEFF/, "").trim().toLowerCase().replace(/[\s_]+/g, "-");

        const headers = rawHeaders.map(keyFor);

        const idx = (name: string) => headers.indexOf(name.toLowerCase());

        const iName = idx("common-name");
        const iSci = idx("scientific-name");
        const iHab = idx("habitat");
        const iDiet = idx("diet");
        const iFact = idx("fun-fact");
        const iStatus = idx("local-status");
        const iOrder = idx("order");
        const iFamily = idx("family");

        const root: FolderNode = { nodeType: "folder", children: {}, items: [] };

        for (let r = 1; r < rows.length; r++) {
            const cells = rows[r];
            if (cells.length === 0) continue;
            if (cells.every(c => c.trim().length === 0)) continue;

            const get = (i: number) => {
                if (i < 0) return "";

                return (cells[i] ?? "")
                    .trim()
                    .replace("/", "/\u200B"); // wrappable after slash
            };

            const localStatus = get(iStatus);
            const order = get(iOrder);
            const name = get(iName);
            if (localStatus.length === 0 || order.length === 0 || name.length === 0) continue;

            const item: Item = {
                name: name,
                scientificName: get(iSci) || undefined,
                habitat: get(iHab) || undefined,
                diet: get(iDiet) || undefined,
                funFact: get(iFact) || undefined,
                localStatus: localStatus,
                order: order,
                family: get(iFamily) || undefined
            };

            const path: string[] = [localStatus, order];
            if (item.family !== undefined && item.family.length > 0) {
                path.push(item.family);
            }

            const node = ensureNodeAtPath(root, path);
            node.items.push(item);
        }

        return new DataContext(JSON.stringify(root));
    }

    public getNode(path: readonly string[]): Node | undefined {
        let n: FolderNode = this.content;

        for (let i = 0; i < path.length; i++) {
            const seg = path[i];

            const child = n.children[seg];
            if (child) {
                n = child;
                continue;
            }

            const item = n.items.find(a => a.name === seg);
            if (item && i === path.length - 1) {
                return {nodeType: "item", item: item};
            }

            return undefined;
        }

        return n;
    }

    public isPathFirstSibling(p: readonly string[]): boolean {
        if (p.length === 0) return true;

        const parent = this.getNode(this.getParentPath(p));
        if (parent?.nodeType !== "folder") return true;

        const siblings = Object.keys(parent.children);
        return siblings.indexOf(p[p.length - 1]) <= 0;
    }

    public isPathLastSibling(p: readonly string[]): boolean {
        if (p.length === 0) return true;

        const parent = this.getNode(this.getParentPath(p));
        if (parent?.nodeType !== "folder") return true;

        const siblings = Object.keys(parent.children);
        const index = siblings.indexOf(p[p.length - 1]);
        return index === siblings.length - 1;
    }

    public getSiblingPath(p: readonly string[], dir: -1 | 1): string[] {
        if (p.length === 0) return [...p];

        const parentPath = this.getParentPath(p);
        const parent = this.getNode(parentPath);
        if (parent?.nodeType !== "folder") return [...p];

        const siblings = Object.keys(parent.children);
        const index = siblings.indexOf(p[p.length - 1]);
        const nextIndex = index + dir;

        if (nextIndex < 0 || nextIndex >= siblings.length) return [...p];

        return [...parentPath, siblings[nextIndex]];
    }

    public getParentPath(p: readonly string[]): string[] {
        if (p.length === 0) return [...p];

        return p.slice(0, -1);
    }
}

function ensureNodeAtPath(root: FolderNode, path: readonly string[]): FolderNode {
    let cur = root;

    for (const key of path) {
        cur.children[key] ??= { nodeType: 'folder', children: {}, items: [] };
        cur = cur.children[key];
    }

    return cur;
}

function parseCsv(csv: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = "";
    let inQuotes = false;

    for (let i = 0; i < csv.length; i++) {
        const ch = csv[i];

        if (inQuotes) {
            if (ch === '"') {
                const next = csv[i + 1];
                if (next === '"') {
                    cell += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                cell += ch;
            }

            continue;
        }

        if (ch === '"') {
            inQuotes = true;
            continue;
        }

        if (ch === ",") {
            row.push(cell);
            cell = "";
            continue;
        }

        if (ch === "\n") {
            row.push(cell);
            cell = "";
            rows.push(row);
            row = [];
            continue;
        }

        if (ch === "\r") {
            continue;
        }

        cell += ch;
    }

    row.push(cell);
    rows.push(row);

    return rows;
}
