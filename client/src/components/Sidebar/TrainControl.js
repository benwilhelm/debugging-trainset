import React from 'react'
import TrainSpeed from './TrainSpeed'
import { ReactComponent as TrashIcon } from '../../img/noun_Trash_2025448.svg'

const ColorIndicator = ({color, onClick}) => {
  return (
    <div className="color-indicator" style={{ backgroundColor: color }} onClick={onClick}>
      <TrashIcon fill="white" />
    </div>
  )
}

export default ({ train, updateTrain, deleteTrain }) => {

  const handleMouseEnter = () => updateTrain({...train, highlight: true })
  const handleMouseLeave = () => updateTrain({...train, highlight: false })

  return (
    <div className="train-control" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <ColorIndicator color={train.colors.main} onClick={() => deleteTrain(train.id)} />
      <TrainSpeed
        updateTrain={updateTrain}
        train={train}
      />
    </div>
  )
}
