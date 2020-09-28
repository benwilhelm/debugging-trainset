import React from 'react'
import EngineSpeed from './EngineSpeed'
import { ReactComponent as TrashIcon } from '../../img/noun_Trash_2025448.svg'

const ColorIndicator = ({color, onClick}) => {
  return (
    <div className="color-indicator" style={{ backgroundColor: color }} onClick={onClick}>
      <TrashIcon fill="white" />
    </div>
  )
}

export default ({ engine, updateEngine, deleteEngine }) => {

  const handleMouseEnter = () => updateEngine({...engine, highlight: true })
  const handleMouseLeave = () => updateEngine({...engine, highlight: false })

  return (
    <div className="engine-control" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <ColorIndicator color={engine.colors.main} onClick={() => deleteEngine(engine.id)} />
      <EngineSpeed
        updateEngine={updateEngine}
        engine={engine}
      />
    </div>
  )
}
