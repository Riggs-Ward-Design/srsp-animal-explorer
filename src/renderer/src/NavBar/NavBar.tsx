import './NavBar.css'
import { ReactElement, useState } from 'react'

interface NavBarProps {
  upLabel?: string
  onMoveUp?: () => void
  onMoveBack?: () => void
  onMoveNext?: () => void
  onReset?: () => void
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

      <div style={{ display: 'flex', gap: '48px', height: '100%', fontSize: '1.25rem' }}>
        <div
          className="nav-bar-button"
          onClick={props.onMoveBack}
          style={{
            opacity: props.onMoveBack ? 1 : 0,
            transition: fadeTransition
          }}
        >
          {`< Previous`}
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

      <div
        className="nav-bar-button"
        onClick={props.onReset}
        style={{
          justifyContent: 'right',
          opacity: props.onReset ? 1 : 0,
          transition: fadeTransition
        }}
      >
        Reset
      </div>
    </div>
  )
}

export default NavBar
