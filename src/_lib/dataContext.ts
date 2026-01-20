export type Item = {
    name: string;
    scientificName?: string;
    habitat?: string;
    diet?: string;
    funFact?: string;
    localStatus?: "Native" | "Non-Native" | "Invasive";
    order?: string;
    family?: string;
};

export type Content = Record<string, Record<string, Item[]>>;

export interface NodeMap { [key: string]: Node; }
export type Node = NodeMap | Item[];

export class DataContext {
    public readonly content: Content;

    // from a JSON string
    public constructor(json: string) {
        this.content = JSON.parse(json) as Content;
    }

    public static fromCsv(csv: string): DataContext {
        const rows = parseCsv(csv);
        if (rows.length === 0) {
            return new DataContext(JSON.stringify({} as Content));
        }

        const rawHeaders = rows[0];

        const keyFor = (h: string) =>
            h.replace(/^\uFEFF/, "").trim().toLowerCase();

        const headers = rawHeaders.map(keyFor);

        const idx = (name: string) => headers.indexOf(name.toLowerCase());

        const iName = idx("common name");
        const iSci = idx("scientific name");
        const iHab = idx("habitat");
        const iDiet = idx("diet");
        const iFact = idx("fun fact");
        if (iFact === -1) {
            // allow "Fun fact" case via lowercase already, but also older column label
        }
        const iStatus = idx("localstatus");
        const iOrder = idx("order");
        const iFamily = idx("family");

        const out: Content = {};

        for (let r = 1; r < rows.length; r++) {
            const cells = rows[r];
            if (cells.length === 0) continue;
            if (cells.every(c => c.trim().length === 0)) continue;

            const get = (i: number) => (i >= 0 ? (cells[i] ?? "").trim() : "");

            const group = get(iStatus) || "Native";
            const category = get(iOrder);
            if (category.length === 0) continue;

            const name = get(iName);
            if (name.length === 0) continue;

            const item: Item = {
                name,
                scientificName: get(iSci) || undefined,
                habitat: get(iHab) || undefined,
                diet: get(iDiet) || undefined,
                funFact: get(idx("fun fact")) || undefined,
                localStatus: parseLocalStatus(group),
                order: category || undefined,
                family: (iFamily >= 0 ? (cells[iFamily] ?? "") : "") || undefined, // blank allowed
            };

            out[group] ??= {};
            out[group][category] ??= [];
            out[group][category].push(item);
        }

        return new DataContext(JSON.stringify(out));
    }


    public isPathFirstSibling(p: readonly string[]): boolean {
        if (p.length === 1) {
            const siblings = Object.keys(this.content);
            return siblings.indexOf(p[0]) <= 0;
        }

        if (p.length === 2) {
            const [group, category] = p;
            const groupNode = this.content[group];
            if (groupNode == null) return true;

            const siblings = Object.keys(groupNode);
            return siblings.indexOf(category) <= 0;
        }

        return true;
    }

    public isPathLastSibling(p: readonly string[]): boolean {
        if (p.length === 1) {
            const siblings = Object.keys(this.content);
            const index = siblings.indexOf(p[0]);
            return index === siblings.length - 1;
        }

        if (p.length === 2) {
            const [group, category] = p;
            const groupNode = this.content[group];
            if (groupNode == null) return true;

            const siblings = Object.keys(groupNode);
            const index = siblings.indexOf(category);
            return index === siblings.length - 1;
        }

        return true;
    }

    public getSiblingPath(p: readonly string[], dir: -1 | 1): string[] {
        if (p.length === 1) {
            const siblings = Object.keys(this.content);
            const index = siblings.indexOf(p[0]);
            const nextIndex = index + dir;

            if (nextIndex < 0 || nextIndex >= siblings.length) return [...p];

            return [siblings[nextIndex]];
        }

        if (p.length === 2) {
            const [group, category] = p;
            const groupNode = this.content[group];
            if (groupNode == null) return [...p];

            const siblings = Object.keys(groupNode);
            const index = siblings.indexOf(category);
            const nextIndex = index + dir;

            if (nextIndex < 0 || nextIndex >= siblings.length) return [...p];

            return [group, siblings[nextIndex]];
        }

        return [...p];
    }

    public getParentPath(p: readonly string[]): string[] {
        if (p.length === 0) return [...p];
        return p.slice(0, -1);
    }
}

function parseLocalStatus(s: string): Item["localStatus"] | undefined {
    if (s === "Native") return "Native";
    if (s === "Non-Native") return "Non-Native";
    if (s === "Invasive") return "Invasive";
    return undefined;
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
