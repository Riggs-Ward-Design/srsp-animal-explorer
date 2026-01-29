import ExplorerView from "./ExplorerView/ExplorerView";
import AssetPreloadView from "./AssetPreloadView/AssetPreloadView.tsx";

function App() {

    return (
        <div style={{ position: "absolute", inset: 0 }}>
            <AssetPreloadView />
            <ExplorerView />
        </div>
    );
}

export default App;
