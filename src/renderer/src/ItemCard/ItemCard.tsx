import './ItemCard.css'
import type { Item } from '../_lib/dataModel'
import { type CSSProperties, type ReactElement, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { findUrl, imageUrls, thumbUrls } from '../_lib/assets'

interface ItemCardProps {
  item: Item
  isOpen: boolean
  onClick?: () => void
  className?: string
  style?: CSSProperties
}

const ItemCard = (props: ItemCardProps): ReactElement => {
  //
  const thumbUrl = findUrl(thumbUrls, props.item.commonName)
  const fullImageUrl = findUrl(imageUrls, props.item.commonName)
  const bgPosition = `${(props.item.align ?? 0.5) * 100}% center`
  const id = `item:${props.item.commonName}`

  const [elevated, setElevated] = useState(true)
  const [lastIsOpen, setLastIsOpen] = useState(props.isOpen)

  if (lastIsOpen !== props.isOpen) {
    setLastIsOpen(props.isOpen)
    if (props.isOpen) setElevated(true)
  }

  useEffect(() => {
    if (props.isOpen) return
    const t = setTimeout(() => setElevated(false), 500)
    return () => clearTimeout(t)
  }, [props.isOpen])

  const [loadedUrl, setLoadedUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!props.isOpen || !fullImageUrl) return
    const img = new Image()
    img.src = fullImageUrl
    img
      .decode()
      .then(() => setLoadedUrl(fullImageUrl))
      .catch(() => {})
  }, [props.isOpen, fullImageUrl])

  const showFull = props.isOpen && loadedUrl === fullImageUrl

  const imageContent = (open: boolean): ReactElement => (
    <motion.div
      layoutId={'image-' + id}
      style={{
        borderRadius: '32px',
        overflow: 'hidden',
        flexBasis: !open ? '100%' : '40%',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundSize: 'cover',
          backgroundPosition: bgPosition,
          backgroundImage: thumbUrl ? `url(${thumbUrl})` : undefined
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundSize: 'cover',
          backgroundPosition: bgPosition,
          backgroundImage: fullImageUrl ? `url(${fullImageUrl})` : undefined,
          opacity: showFull ? 1 : 0,
          transition: 'opacity 0.25s ease'
        }}
      />
    </motion.div>
  )

  return (
    <motion.div
      layoutId={id}
      onClick={props.onClick}
      className={props.className + ' item-card'}
      style={{
        ...props.style,
        borderRadius: '32px',
        overflow: 'hidden',
        zIndex: elevated ? 10 : 0
      }}
    >
      {!props.isOpen && imageContent(false)}
      {props.isOpen && imageContent(true)}

      <AnimatePresence initial={false} mode="popLayout">
        {props.isOpen && (
          <motion.div
            key="content"
            className="item-card-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="name">
              <h1>{props.item.commonName}</h1>
              <span className="sci-name">{props.item.scientificName}</span>
            </div>

            {props.item.texts.map(({ heading, body }, i) => (
              <section key={i} style={{ gridArea: ['habitat', 'diet', 'fun'][i] }}>
                <h2>{heading}:</h2>
                <p>{body}</p>
              </section>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ItemCard
