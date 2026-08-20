import './ExplorerView.css'
import NavBar from '../NavBar/NavBar'
import { ReactElement } from 'react'
import { DataModel, FolderNode, ItemNode } from '../_lib/dataModel'
import { getChildren, getNode, getParentPath } from '../_lib/dataModelUtility'
import { useDataModel } from '../_lib/useDataModel'
import ExplorerCarousel from '../ExplorerCarousel/ExplorerCarousel'
import DirectionalTransitions from '../rwd-library/DirectionalTransitions/DirectionalTransitions'

interface ExplorerViewProps {
  dataModel: DataModel
  onReset?: () => void
}

const ExplorerView = (props: ExplorerViewProps): ReactElement => {
  //
  const {
    path,
    node,
    parentNode,
    lastChildName,
    push,
    canGoUp,
    canGoToPrev,
    canGoToNext,
    up,
    prev,
    next
  } = useDataModel(props.dataModel)

  const getFolderLabel = (p: string[]): string => {
    if (p.length === 0) return 'Who Lives Here?'
    if (p.length === 1) {
      if (p[0] === 'Native') return `Learn About Year-Round Residents`
      return `Learn About ${p[0]} Species`
    }
    return `${p[0]} ${p[p.length - 1]}`
  }

  const pathForCarousel = node.nodeType == 'folder' ? path : getParentPath(path)

  return (
    <div className="explorer-view">
      <div className="explorer-content">
        <DirectionalTransitions
          currentPosition={{ x: 0, y: 0, z: pathForCarousel.length }}
          options={{ duration: 0.35 }}
        >
          <ExplorerCarousel
            entries={getChildren(node.nodeType === 'folder' ? node : parentNode)}
            openFolderNode={getNode(props.dataModel.content, pathForCarousel) as FolderNode}
            openItemNode={node.nodeType === 'item' ? (node as ItemNode) : undefined}
            focusedChildName={lastChildName}
            title={getFolderLabel(pathForCarousel)}
            push={push}
          />
        </DirectionalTransitions>
      </div>

      <NavBar
        upLabel={canGoUp ? getFolderLabel(getParentPath(path)) : undefined}
        onMoveUp={canGoUp ? up : undefined}
        onMoveBack={canGoToPrev ? prev : undefined}
        onMoveNext={canGoToNext ? next : undefined}
        onReset={props.onReset}
      />
    </div>
  )
}

export default ExplorerView
