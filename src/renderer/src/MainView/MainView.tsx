/**
 * Created by Will on 2/12/2026
 */

import ExplorerView from '../ExplorerView/ExplorerView'
import AttractScreen from '../AttractScreen/AttractScreen'
import { useIdleTimer } from 'react-idle-timer'
import { ReactElement, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DataModel } from '@renderer/_lib/dataModel'

interface MainViewProps {
  dataModel: DataModel
  timeout: number
  flipped?: boolean
}

function MainView(props: MainViewProps): ReactElement {
  //
  const [isActive, setIsActive] = useState(false)
  const [remainingTime, setRemainingTime] = useState(props.timeout)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  const idleTimer = useIdleTimer({
    element: container ?? undefined,
    onIdle: () => setIsActive(false),
    onAction: () => setIsActive(true),
    timeout: props.timeout * 1000
  })

  // Update remaining time every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = idleTimer.getRemainingTime()
      setRemainingTime(Math.ceil(remaining / 1000)) // Convert to seconds
    }, 100)

    return () => clearInterval(interval)
  }, [idleTimer])

  return (
    <div
      ref={setContainer}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        rotate: props.flipped ? '180deg' : '0deg'
      }}
    >
      <AnimatePresence mode={'popLayout'}>
        {isActive ? (
          <motion.div
            key="explorer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: isActive ? 0.25 : 4.0
            }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%'
            }}
          >
            <ExplorerView
              dataModel={props.dataModel}
              idleTimerPosition={remainingTime}
              onReset={() => setIsActive(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="attract"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: isActive ? 0.25 : 4.0
            }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%'
            }}
          >
            <AttractScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainView
