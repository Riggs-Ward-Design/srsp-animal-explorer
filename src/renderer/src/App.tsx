import MainView from './MainView/MainView'
import { ReactElement, useMemo } from 'react'
import { DataModel } from '@renderer/_lib/dataModel'
import contentCSV from './_assets/srsp animal facts.csv?raw'

function App(): ReactElement {
  //
  const SECONDS_BEFORE_IDLE_TIMEOUT = 30

  const dataModel = useMemo(() => DataModel.fromCsv(contentCSV), [])

  // SINGLE

  // return (
  //     <div style={{ position: "absolute", inset: 0, display: 'flex', alignItems: "center", justifyContent: "center" }}>
  //         <div style={{width: '960px', height: '540px'}}><MainView dataModel={dataModel} timeout={SECONDS_BEFORE_IDLE_TIMEOUT}/></div>
  //     </div>
  // );

  // QUAD

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '4px',
        backgroundColor: '#737d50'
      }}
    >
      <MainView dataModel={dataModel} timeout={SECONDS_BEFORE_IDLE_TIMEOUT} flipped />
      <MainView dataModel={dataModel} timeout={SECONDS_BEFORE_IDLE_TIMEOUT} flipped />
      <MainView dataModel={dataModel} timeout={SECONDS_BEFORE_IDLE_TIMEOUT} />
      <MainView dataModel={dataModel} timeout={SECONDS_BEFORE_IDLE_TIMEOUT} />
    </div>
  )
}

export default App
