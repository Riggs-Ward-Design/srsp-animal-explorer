/**
 * Created by Will on 2/12/2026
 */

import MainView from "./MainView/MainView.tsx";

function App() {

    const SECONDS_BEFORE_IDLE_TIMEOUT = 30;

    const viewMode: 'single' | 'quad' = 'single';

    if (viewMode === 'single') return (
        <div style={{ position: "absolute", inset: 0, display: 'flex', alignItems: "center", justifyContent: "center" }}>
            <div style={{width: '960px', height: '540px'}}><MainView timeout={SECONDS_BEFORE_IDLE_TIMEOUT}/></div>
        </div>
    );

    return (
        <div style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: '4px',
            backgroundColor: '#737d50',
        }}>
            <MainView timeout={SECONDS_BEFORE_IDLE_TIMEOUT} flipped/>
            <MainView timeout={SECONDS_BEFORE_IDLE_TIMEOUT} flipped/>
            <MainView timeout={SECONDS_BEFORE_IDLE_TIMEOUT}/>
            <MainView timeout={SECONDS_BEFORE_IDLE_TIMEOUT}/>
        </div>
    );
}

export default App;