/**
 * Created by Will on 2/12/2026
 */

import ExplorerView from '../ExplorerView/ExplorerView'
import AttractScreen from '../AttractScreen/AttractScreen'
import ContentWithTimeout from '../rwd-library/ContentWithTimeout/ContentWithTimeout'
import { ReactElement } from 'react'
import { DataModel } from '@renderer/_lib/dataModel'
import './MainView.css'

interface MainViewProps {
  dataModel: DataModel
  timeout: number
  flipped?: boolean
}

function MainView(props: MainViewProps): ReactElement {
  //
  return (
    <div
      className="main-view"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        rotate: props.flipped ? '180deg' : '0deg'
      }}
    >
      <ContentWithTimeout
        timeout={props.timeout}
        attractView={<AttractScreen />}
        contentView={(onReset) => <ExplorerView dataModel={props.dataModel} onReset={onReset} />}
        idleWarningModal={{
          background: 'var(--color-green)',
          backgroundOpacity: 0.85,
          textStyle: {
            fontFamily: "'Meursault', serif",
            fontStyle: 'oblique',
            fontSize: '2.5cqw'
          }
        }}
      />
    </div>
  )
}

export default MainView
