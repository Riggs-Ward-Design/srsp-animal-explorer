import { useIdleTimer } from 'react-idle-timer'
import { CSSProperties, ReactNode, ReactElement, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Property } from 'csstype'
import './ContentWithTimeout.css'

interface IdleWarningModalProps {
  warnAtSecondsRemaining?: number
  background?: Property.Background
  backgroundOpacity?: number
  textStyle?: CSSProperties
}

interface ContentWithTimeoutProps {
  timeout: number
  attractView: ReactNode
  contentView: (onReset: () => void) => ReactNode
  onActiveChange?: (isActive: boolean) => void
  idleWarningModal?: IdleWarningModalProps
}

const idleWarningDefaultTextStyle: CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '1.5cqw',
  fontWeight: 400,
  color: 'white',
  letterSpacing: '0.02em',
  fontVariantNumeric: 'tabular-nums'
}

function ContentWithTimeout(props: ContentWithTimeoutProps): ReactElement {
  //
  const [isActive, setIsActive] = useState(false)
  const [remainingTime, setRemainingTime] = useState(props.timeout)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  const modal = props.idleWarningModal ?? {}
  const warningThreshold = (modal.warnAtSecondsRemaining ?? 5) + 1
  const background = modal.background ?? 'black'
  const backgroundOpacity = modal.backgroundOpacity ?? 0.75
  const textStyle = { ...idleWarningDefaultTextStyle, ...modal.textStyle }

  const idleTimer = useIdleTimer({
    element: container ?? undefined,
    onIdle: () => {
      setIsActive(false)
      idleTimer.pause()
    },
    timeout: props.timeout * 1000,
    events: ['click'],
    startManually: true
  })

  const activate = (): void => {
    setIsActive(true)
    idleTimer.start()
  }

  useEffect(() => {
    props.onActiveChange?.(isActive)
  }, [isActive, props])

  // Update remaining time every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = idleTimer.getRemainingTime()
      setRemainingTime(Math.ceil(remaining / 1000))
    }, 100)

    return () => clearInterval(interval)
  }, [idleTimer])

  const onReset = (): void => {
    setIsActive(false)
    idleTimer.pause()
  }

  // Idle warning overlay state
  const effectiveRemaining = isActive ? remainingTime : 0
  const showWarning = effectiveRemaining > 0 && effectiveRemaining < warningThreshold
  const warningOpacity = effectiveRemaining <= 1 ? 1.0 : backgroundOpacity
  const isIdle = effectiveRemaining === 0

  // noinspection JSUnusedGlobalSymbols
  return (
    <div
      ref={setContainer}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >
      <AnimatePresence mode={'popLayout'}>
        {isActive ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {props.contentView(onReset)}
          </motion.div>
        ) : (
          <motion.div
            key="attract"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ position: 'absolute', inset: 0 }}
            onClick={activate}
          >
            {props.attractView}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle warning modal — background layer */}
      <AnimatePresence custom={isIdle}>
        {showWarning && (
          <motion.div
            className="cwt-idle-warning-modal"
            custom={isIdle}
            initial={{ opacity: 0 }}
            animate={{ opacity: warningOpacity, transition: { duration: 1 } }}
            exit="hidden"
            variants={{
              hidden: (idle: boolean) => ({
                opacity: 0,
                transition: { duration: 0.5, delay: idle ? 0.5 : 0 }
              })
            }}
            style={{
              background,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'opacity 1s linear'
            }}
          />
        )}
      </AnimatePresence>

      {/* Idle warning modal — content layer */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            className="cwt-idle-warning-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <div style={textStyle}>{`Going to sleep in ${effectiveRemaining}…`}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ContentWithTimeout
