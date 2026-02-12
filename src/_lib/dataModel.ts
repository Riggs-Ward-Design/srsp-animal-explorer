export type Item = {
    commonName: string;
    scientificName: string;
    habitat: string;
    diet: string;
    funFact: string;
    localStatus: string;
    order: string;
    family?: string;
};

export type FolderNode = {
    nodeType: "folder";
    name: string;
    children: Record<string, Node>;
};

export type ItemNode = {
    nodeType: "item";
    name: string;
    item: Item;
};

export type Node = FolderNode | ItemNode;

const createRoot = (): FolderNode => ({
    nodeType: "folder",
    name: "__root__",
    children: {},
});

const compareNodes = (a: Node, b: Node) => {
    if (a.nodeType !== b.nodeType) {
        return a.nodeType === "folder" ? -1 : 1;
    }

    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
};

const rebuildChildrenSorted = (children: Record<string, Node>) => {
    const entries = Object.entries(children);
    entries.sort(([, a], [, b]) => compareNodes(a, b));

    const rebuilt: Record<string, Node> = {};
    for (const [k, v] of entries) {
        rebuilt[k] = v;
    }

    return rebuilt;
};

const setChildSorted = (parent: FolderNode, child: Node) => {
    parent.children[child.name] = child;
    parent.children = rebuildChildrenSorted(parent.children);
};

export class DataModel {
    public readonly content: FolderNode;

    public static empty(): DataModel {
        return new DataModel(JSON.stringify(createRoot()));
    }

    public constructor(json: string) {
        this.content = JSON.parse(json) as FolderNode;
    }

    public static fromCsv(csv: string): DataModel {
        const rows = parseCsv(csv);
        if (rows.length === 0) return DataModel.empty();

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

        const root = createRoot();

        for (let r = 1; r < rows.length; r++) {
            const cells = rows[r];
            if (cells.length === 0) continue;
            if (cells.every(c => c.trim().length === 0)) continue;

            const get = (i: number) => {
                if (i < 0) return "";
                return (cells[i] ?? "").trim().replace("/", "/\u200B");
            };

            const localStatus = get(iStatus);
            const order = get(iOrder);
            const name = get(iName);
            if (localStatus.length === 0 || order.length === 0 || name.length === 0) continue;

            const item: Item = {
                commonName: name,
                scientificName: get(iSci),
                habitat: get(iHab),
                diet: get(iDiet),
                funFact: get(iFact),
                localStatus,
                order,
                family: get(iFamily) || undefined
            };

            const path: string[] = [localStatus, order];
            if (item.family) path.push(item.family);

            const folder = ensureFolderAtPath(root, path);

            setChildSorted(folder, {
                nodeType: "item",
                name: item.commonName,
                item
            });
        }

        return new DataModel(JSON.stringify(root));
    }

    public getNode(path: readonly string[]): Node | undefined {

        if (!path) return undefined;

        let n: Node = this.content;

        for (const seg of path) {
            if (n.nodeType !== "folder") return undefined;
            n = n.children[seg];
            if (!n) return undefined;
        }

        return n;
    }

    public getChildren(folder: FolderNode): Node[] {
        return Object.values(folder.children);
    }

    public getSiblingPath(p: readonly string[], dir: -1 | 1): string[] | undefined {
        if (p.length === 0) return undefined;

        const parentPath = this.getParentPath(p);
        const parent = this.getNode(parentPath);
        if (parent?.nodeType !== "folder") return undefined;

        const siblings = Object.keys(parent.children);
        const index = siblings.indexOf(p[p.length - 1]);
        const nextIndex = index + dir;

        if (nextIndex < 0 || nextIndex >= siblings.length) return undefined;

        return [...parentPath, siblings[nextIndex]];
    }

    public getParentPath(p: readonly string[]): string[] {
        if (p.length === 0) return [...p];
        return p.slice(0, -1);
    }
}

function ensureFolderAtPath(root: FolderNode, path: readonly string[]): FolderNode {
    let cur = root;

    for (const key of path) {
        const existing = cur.children[key];
        if (existing?.nodeType === "folder") {
            cur = existing;
            continue;
        }

        const created: FolderNode = { nodeType: "folder", name: key, children: {} };
        setChildSorted(cur, created);
        cur = created;
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