import './FolderButton.css'
import { Node } from '../_lib/dataModel'
import { CSSProperties, ReactElement } from 'react'
import { motion } from 'framer-motion'

import iconFish from '../_assets/animal icons/animal icons_Fish.svg'
import iconBirds from '../_assets/animal icons/animal icons_Bird.svg'
import iconInsects from '../_assets/animal icons/animal icons_Insect.svg'
import iconMammals from '../_assets/animal icons/animal icons_Mammal.svg'
import iconReptiles from '../_assets/animal icons/animal icons_Reptile.svg'
import iconAmphibians from '../_assets/animal icons/animal icons_Amphibian.svg'

interface FolderButtonProps {
  node?: Node
  onClick?: () => void
  className?: string
  style?: CSSProperties
}

const FolderButton = (props: FolderButtonProps): ReactElement => {
  // Spacer only
  if (!props.node)
    return <div className={props.className} style={{ opacity: 0, pointerEvents: 'none' }} />

  let text: string = props.node.name
  let delayAppear = 0

  // Special stuff for top page
  if (text === 'Native') {
    text = `Year-Round Residents`
    delayAppear = 1
  }
  if (text === 'Invasive') {
    text = `I Don't Belong Here`
    delayAppear = 2
  }

  let animalIcon = ''
  if (text === 'Fish') animalIcon = iconFish
  else if (text === 'Birds') animalIcon = iconBirds
  else if (text === 'Insects') animalIcon = iconInsects
  else if (text === 'Mammals') animalIcon = iconMammals
  else if (text === 'Reptiles') animalIcon = iconReptiles
  else if (text === 'Amphibians') animalIcon = iconAmphibians

  return (
    <motion.div
      className={props.className + ' rounded'}
      onClick={props.onClick}
      initial={{
        opacity: 0,
        pointerEvents: 'none'
      }}
      animate={{
        opacity: props.style?.opacity ?? 1,
        pointerEvents: 'auto'
      }}
      transition={{ delay: delayAppear * 0.75, duration: 0.5 }}
    >
      <div className="folder-button-contents">
        {animalIcon !== '' && <img src={animalIcon} alt={`${text} Icon`} />}
        {text}
      </div>
    </motion.div>
  )
}

export default FolderButton
