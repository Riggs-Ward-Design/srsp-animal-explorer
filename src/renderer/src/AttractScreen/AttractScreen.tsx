/**
 * Created by Will on 2/12/2026
 */

import { motion } from 'framer-motion'
import './AttractScreen.css'
import Shimmer from '../rwd-library/Shimmer/Shimmer'
import { ReactElement } from 'react'

const AttractScreen = (): ReactElement => {
  //
  return (
    <div className="attract-screen">
      <motion.div
        className="attract-screen-titles-wrapper"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1.0 }}
        transition={{ duration: 3 }}
      >
        <h1>Learn About Local Critters</h1>
        <Shimmer duration={1.5} frequency={6} color={'#fff4'} maxIterations={3}>
          <h2>Touch To Start</h2>
        </Shimmer>
      </motion.div>
    </div>
  )
}

export default AttractScreen
