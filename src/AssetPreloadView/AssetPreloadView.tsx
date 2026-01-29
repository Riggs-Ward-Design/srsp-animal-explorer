import { useEffect, useState } from "react";
import {preloadAllBitmaps} from "../_lib/assets.ts";

interface AssetPreloadViewProps {
    onFinished: () => void;
}

const AssetPreloadView = (props: AssetPreloadViewProps) => {
    const [numberOfLoadedAssets, setNumberOfLoadedAssets] = useState(0);
    const [numberOfTotalAssets, setNumberOfTotalAssets] = useState(0);
    const [lastLoadedAssetPath, setLastLoadedAssetPath] = useState<string | undefined>();

    const getNameFromPath = (path: string | undefined) => {
        if (!path) return undefined;
        const ar = path.split('/');
        return ar[ar.length - 1];
    }

    useEffect(() => {

        let cancelled = false;
        preloadAllBitmaps((l: number, t: number, url?: string) => {
            if (cancelled) return;
            setNumberOfLoadedAssets(l);
            setNumberOfTotalAssets(t);
            setLastLoadedAssetPath(url);
        }).then(() => {
            if (!cancelled) props.onFinished();
        });

        return () => {
            cancelled = true;
        }

    }, []);

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center"
            }}
        >
            <div>
                Loading images {numberOfLoadedAssets} / {numberOfTotalAssets}<br />
                {getNameFromPath(lastLoadedAssetPath)}
            </div>
        </div>
    );
}

export default AssetPreloadView;
