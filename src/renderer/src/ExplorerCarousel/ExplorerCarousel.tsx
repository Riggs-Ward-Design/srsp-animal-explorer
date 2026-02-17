import './ExplorerCarousel.css'
import StandardIconButton from '../rwd-library/StandardIconButton/StandardIconButton'
import FolderButton from '../FolderButton/FolderButton'
import type { Node, ItemNode, FolderNode } from '../_lib/dataModel'
import { ReactElement, useMemo, useState } from 'react'
import ItemCard from '../ItemCard/ItemCard'
import { motion } from 'motion/react'

interface ExplorerCarouselProps {
  entries: Node[]
  openFolderNode: FolderNode
  openItemNode?: ItemNode
  focusedChildName?: string
  push: (label: string) => void
  title?: string
}

const PAGE_SIZE = 6

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const pages: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    pages.push(arr.slice(i, i + size))
  }
  return pages.length > 0 ? pages : [[]]
}

const FADE_OPACITY = 0.25

const initialPage = (entries: Node[], focusedChildName?: string): number => {
  if (!focusedChildName) return 0
  const index = entries.findIndex((n) => n.name === focusedChildName)
  return index >= 0 ? Math.floor(index / PAGE_SIZE) : 0
}

const ExplorerCarousel = (props: ExplorerCarouselProps): ReactElement => {
  //
  const [currentPage, setCurrentPage] = useState(() =>
    initialPage(props.entries, props.focusedChildName)
  )
  const [prevFolderName, setPrevFolderName] = useState(props.openFolderNode.name)
  const [lastOpenItem, setLastOpenItem] = useState(props.openItemNode)

  if (lastOpenItem !== props.openItemNode) {
    setLastOpenItem(props.openItemNode)
    if (props.openItemNode) {
      const index = props.entries.indexOf(props.openItemNode)
      if (index >= 0) setCurrentPage(Math.floor(index / PAGE_SIZE))
    }
  }

  if (prevFolderName !== props.openFolderNode.name) {
    setPrevFolderName(props.openFolderNode.name)
    if (props.focusedChildName) {
      const index = props.entries.findIndex((n) => n.name === props.focusedChildName)
      setCurrentPage(index >= 0 ? Math.floor(index / PAGE_SIZE) : 0)
    } else {
      setCurrentPage(0)
    }
  }

  const pages = useMemo(() => chunk(props.entries, PAGE_SIZE), [props.entries])

  const currentButtonsPage = Math.max(0, Math.min(currentPage, pages.length - 1))
  const canPageLeft = pages.length > 1 && currentButtonsPage > 0
  const canPageRight = pages.length > 1 && currentButtonsPage < pages.length - 1

  return (
    <div key={`carousel-${props.openFolderNode.name}`} className="carousel">
      {props.title && (
        <h1
          style={{
            opacity: !props.openItemNode ? 1 : FADE_OPACITY,
            transition: 'opacity 500ms'
          }}
        >
          {props.title}
        </h1>
      )}

      <div className="carousel-row">
        <div className="carousel-button-area">
          {canPageLeft && (
            <StandardIconButton
              onClick={() => setCurrentPage((p) => p - 1)}
              style={{
                opacity: !props.openItemNode ? 1 : FADE_OPACITY,
                pointerEvents: !props.openItemNode ? 'auto' : 'none',
                transition: 'opacity 500ms'
              }}
              iconName="left-chevron"
            />
          )}
        </div>

        <div className="carousel-viewport">
          <div
            className="carousel-track"
            style={{ transform: `translateX(${-currentButtonsPage * 100}%)` }}
          >
            {pages.map((page, pageIndex) => (
              <div className="carousel-page" key={`page:${pageIndex}`}>
                {page.map((n) => {
                  const isOnCurrentPage = pageIndex === currentButtonsPage

                  if (n.nodeType === 'folder') {
                    return (
                      <FolderButton
                        className="carousel-button"
                        key={`folder:${n.name}`}
                        node={n}
                        onClick={() => props.push(n.name)}
                        style={{
                          opacity: isOnCurrentPage ? 1 : 0,
                          pointerEvents: isOnCurrentPage ? 'auto' : 'none',
                          transition: 'opacity 500ms'
                        }}
                      />
                    )
                  }

                  const isOpen = props.openItemNode === n

                  return (
                    <div key={`item-wrap:${n.name}`} style={{ display: 'contents' }}>
                      {!isOpen && (
                        <ItemCard
                          item={n.item}
                          isOpen={false}
                          onClick={() => props.push(n.name)}
                          className="carousel-button"
                          style={{
                            opacity: isOnCurrentPage ? (!props.openItemNode ? 1 : FADE_OPACITY) : 0,
                            pointerEvents: isOnCurrentPage
                              ? !props.openItemNode
                                ? 'auto'
                                : 'none'
                              : 'none',
                            transition: 'opacity 500ms'
                          }}
                        />
                      )}
                      {isOpen && <div className="carousel-button placeholder" />}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {props.title === 'Who Lives Here?' && (
            <motion.div
              className="touch-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 4 } }}
            >
              Touch any button to start exploring.
            </motion.div>
          )}
        </div>

        <div className="carousel-button-area">
          {canPageRight && (
            <StandardIconButton
              onClick={() => setCurrentPage((p) => p + 1)}
              style={{
                opacity: !props.openItemNode ? 1 : FADE_OPACITY,
                pointerEvents: !props.openItemNode ? 'auto' : 'none',
                transition: 'opacity 500ms'
              }}
              iconName="right-chevron"
            />
          )}
        </div>
      </div>

      {props.openItemNode && (
        <ItemCard
          key={props.openItemNode.name}
          item={props.openItemNode.item}
          isOpen={true}
          className="carousel-open-card"
        />
      )}
    </div>
  )
}

export default ExplorerCarousel
