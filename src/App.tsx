/**
 * Created by Will on 2/12/2026
 */

import MainView from "./MainView/MainView.tsx";

function App() {

    const viewMode: 'single' | 'quad' = 'single';

    if (viewMode === 'single') return (
        <div style={{ position: "absolute", inset: 0, display: 'flex', alignItems: "center", justifyContent: "center" }}>
            <div style={{width: '960px', height: '540px'}}><MainView/></div>
        </div>
    );

    return (
        <div style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr"
        }}>
            <MainView flipped/>
            <MainView flipped/>
            <MainView/>
            <MainView/>
        </div>
    );
}

export default App;