import React from 'react'
import { connect } from 'react-redux'
import {
  selectAllTrains,
  updateTrain,
  deleteTrain,
  addCarToTrain,
  removeCarFromTrain,
} from '../../store'
import TrainControl from './TrainControl'
import './index.css'

const Sidebar = ({ trains, dispatchUpdateTrain, dispatchDeleteTrain, dispatchAddCar, dispatchRemoveCar }) => (
  <div className="sidebar">
    {trains.map(train => (
      <TrainControl
        key={`train-control-${train.id}`}
        train={train}
        updateTrain={dispatchUpdateTrain}
        deleteTrain={dispatchDeleteTrain}
        addCar={dispatchAddCar}
        removeCar={dispatchRemoveCar}
      />
    ))}
  </div>
)

const mapState = (state) => ({
  trains: selectAllTrains(state)
})

const mapDispatch = (dispatch) => ({
  dispatchUpdateTrain: (...args) => dispatch(updateTrain(...args)),
  dispatchDeleteTrain: (...args) => dispatch(deleteTrain(...args)),
  dispatchAddCar: (...args) => dispatch(addCarToTrain(...args)),
  dispatchRemoveCar: (...args) => dispatch(removeCarFromTrain(...args)),
})

export default connect(mapState, mapDispatch)(Sidebar)
