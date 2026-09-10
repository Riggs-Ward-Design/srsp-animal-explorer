import MainView from './MainView/MainView'
import { ReactElement, useEffect, useMemo } from 'react'
import { DataModel } from '@renderer/_lib/dataModel'
import { useConfig } from '@renderer/_lib/appConfig'
import { logMissingOrUnusedImages } from '@renderer/_lib/assets'
import contentYAML from './_assets/srsp animal facts.yaml?raw'

function App(): ReactElement {
  //
  const config = useConfig()
  const timeout = Math.max(1, config.get('timeToIdle', 60))
  const quadMode = config.get('quadMode', true)

  const dataModel = useMemo(() => DataModel.fromYaml(contentYAML), [])
  useEffect(() => logMissingOrUnusedImages(dataModel.getAllItemNames()), [])

  if (!quadMode) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ width: '100%', height: '100%' }}>
          <MainView dataModel={dataModel} timeout={timeout} />
        </div>
      </div>
    )
  }

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
      <MainView dataModel={dataModel} timeout={timeout} flipped />
      <MainView dataModel={dataModel} timeout={timeout} flipped />
      <MainView dataModel={dataModel} timeout={timeout} />
      <MainView dataModel={dataModel} timeout={timeout} />
    </div>
  )
}

export default App
