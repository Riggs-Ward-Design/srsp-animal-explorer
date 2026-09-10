import { LayoutGroup, MotionConfig, type Point } from 'motion/react'
import { type CSSProperties, type ReactElement, type ReactNode, useId } from 'react'

interface FlippableSurfaceProps {
  flipped?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/**
 * Layout animations are measured in viewport coordinates but applied as transforms in the
 * surface's own coordinate space. Handing motion the inverse mapping keeps them correct while
 * the surface is turned. Only a half turn is expressible this way; a quarter turn would swap
 * the axes of every measured box.
 */
const halfTurnPoint = (point: Point): Point => ({ x: -point.x, y: -point.y })
const identityPoint = (point: Point): Point => point

const FlippableSurface = (props: FlippableSurfaceProps): ReactElement => {
  //
  // Keeps each surface's shared layout ids from colliding with an identical view elsewhere.
  const groupId = useId()

  return (
    <div
      className={props.className}
      style={{ ...props.style, rotate: props.flipped ? '180deg' : '0deg' }}
    >
      <MotionConfig transformPagePoint={props.flipped ? halfTurnPoint : identityPoint}>
        <LayoutGroup id={groupId}>{props.children}</LayoutGroup>
      </MotionConfig>
    </div>
  )
}

export default FlippableSurface
