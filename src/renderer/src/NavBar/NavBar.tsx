import { AnimatePresence, motion } from 'framer-motion'
import './NavBar.css'
import { ReactElement, useState } from 'react'

interface NavBarProps {
  upLabel?: string
  onMoveUp?: () => void
  onMoveBack?: () => void
  onMoveNext?: () => void
  onReset?: () => void
  idleTimerPosition?: number
}

const NavBar = (props: NavBarProps): ReactElement => {
  //
  const fadeTransition = 'opacity 250ms'
  const [upLabel, setUpLabel] = useState<string>('')
  const [prevUpLabel, setPrevUpLabel] = useState<string | undefined>(upLabel)

  if (prevUpLabel !== props.upLabel) {
    setPrevUpLabel(props.upLabel)
    if (props.upLabel !== undefined) {
      setUpLabel(props.upLabel.replace('Learn About', ''))
    }
  }

  const isIdleSoon = props.idleTimerPosition && props.idleTimerPosition <= 5

  return (
    <div className="nav-bar">
      <div
        className="nav-bar-button"
        onClick={props.onMoveUp}
        style={{
          justifyContent: 'left',
          opacity: props.onMoveUp ? 1 : 0,
          transition: fadeTransition
        }}
      >
        {`< ${upLabel}`}
      </div>

      <div style={{ display: 'flex', gap: '4.5vw', height: '100%', fontSize: '1.75vw' }}>
        <div
          className="nav-bar-button"
          onClick={props.onMoveBack}
          style={{
            opacity: props.onMoveBack ? 1 : 0,
            transition: fadeTransition
          }}
        >
          {`< Back`}
        </div>
        <div
          className="nav-bar-button"
          onClick={props.onMoveNext}
          style={{
            opacity: props.onMoveNext ? 1 : 0,
            transition: fadeTransition
          }}
        >
          {'Next >'}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {!isIdleSoon && (
          <motion.div
            key="reset"
            onClick={props.onReset}
            className="nav-bar-button"
            style={{
              justifyContent: 'right'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Reset
          </motion.div>
        )}

        {isIdleSoon && (
          <motion.div
            key="idle-warning"
            className="nav-bar-button idle-warning"
            style={{
              justifyContent: 'right'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1 } }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              style={{ display: 'inline-block' }}
              initial={{
                maskImage: 'linear-gradient(90deg, black, black)',
                maskSize: '0% 100%',
                maskPosition: 'right',
                maskRepeat: 'no-repeat'
              }}
              animate={{ maskSize: '100% 100%' }}
              transition={{ maskSize: { duration: 1, ease: 'easeInOut' } }}
            >
              {`Going to sleep in ${props.idleTimerPosition}...`}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NavBar
