import { AnimatePresence, motion } from 'framer-motion'
import { ReactElement } from 'react'
import './IdleWarningOverlay.css'

interface IdleWarningOverlayProps {
  remainingTime: number
  warningThreshold?: number
}

const bgVariants = {
  initial: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  hidden: (isSleeping: boolean) => ({
    opacity: 0,
    transition: { duration: 0.5, delay: isSleeping ? 0.5 : 0 }
  })
}

const contentVariants = {
  initial: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  hidden: { opacity: 0, transition: { duration: 0.5 } }
}

const IdleWarningOverlay = ({
  remainingTime,
  warningThreshold = 5
}: IdleWarningOverlayProps): ReactElement => {
  //
  warningThreshold++
  const show = remainingTime > 0 && remainingTime < warningThreshold
  const bgOpacity = remainingTime <= 1 ? 1.0 : 0.85
  const isSleeping = remainingTime === 0

  return (
    <>
      <AnimatePresence custom={isSleeping}>
        {show && (
          <motion.div
            className="idle-warning-overlay"
            custom={isSleeping}
            variants={bgVariants}
            initial="initial"
            animate="visible"
            exit="hidden"
            style={{
              background: `hsl(70, 48%, 26%, ${bgOpacity})`,
              transition: 'background 1s linear'
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {show && (
          <motion.div
            className="idle-warning-overlay"
            variants={contentVariants}
            initial="initial"
            animate="visible"
            exit="hidden"
            style={{ background: 'transparent' }}
          >
            <div className="idle-warning-overlay-label">
              {`Going to sleep in ${remainingTime}…`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default IdleWarningOverlay
