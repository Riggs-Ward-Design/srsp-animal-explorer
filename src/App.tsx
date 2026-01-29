import ExplorerView from "./ExplorerView/ExplorerView";
import AssetPreloadView from "./AssetPreloadView/AssetPreloadView.tsx";
import { useState } from "react";

function App() {

    const [ready, setReady] = useState(false);

    if (!ready) {
        return (
            <AssetPreloadView onFinished={() => setReady(true)} />
        );
    }

    return (
        <div style={{ position: "absolute", inset: 0 }}>
            <ExplorerView />
        </div>
    );
}

export default App;
