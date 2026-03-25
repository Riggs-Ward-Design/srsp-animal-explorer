import MainView from './MainView/MainView'
import { ReactElement, useMemo } from 'react'
import { DataModel } from '@renderer/_lib/dataModel'
import contentYAML from './_assets/srsp animal facts.yaml?raw'

function App(): ReactElement {
  //
  const SECONDS_BEFORE_IDLE_TIMEOUT = 10

  const dataModel = useMemo(() => DataModel.fromYaml(contentYAML), [])

  // SINGLE

  // return (
  //   <div
  //     style={{
  //       position: 'absolute',
  //       inset: 0,
  //       display: 'flex',
  //       alignItems: 'center',
  //       justifyContent: 'center'
  //     }}
  //   >
  //     <div style={{ width: '100%', height: '100%' }}>
  //       <MainView dataModel={dataModel} timeout={SECONDS_BEFORE_IDLE_TIMEOUT} />
  //     </div>
  //   </div>
  // )

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
