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

const TrainControl = ({ train, updateTrain, deleteTrain, addCar, removeCar }) => {

  const handleMouseEnter = () => updateTrain({...train, highlight: true })
  const handleMouseLeave = () => updateTrain({...train, highlight: false })

  return (
    <div className="train-control" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="row">
        <ColorIndicator color={train.colors.main} onClick={() => deleteTrain(train)} />
        <div className="controls">
          <div className="row car-controls">
            <button onClick={() => removeCar(train)}>Remove Car</button>
            <button onClick={() => addCar(train)}>Add Car</button>
          </div>
          <TrainSpeed
            updateTrain={updateTrain}
            train={train}
          />

        </div>
      </div>
    </div>
  )
}

export default TrainControl
