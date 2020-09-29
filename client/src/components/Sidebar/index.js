import React from 'react'
import { connect } from 'react-redux'
import { selectAllTrains, updateTrain, deleteTrain } from '../../store'
import TrainControl from './TrainControl'
import './index.css'

const Sidebar = ({ trains, dispatchUpdateTrain, dispatchDeleteTrain }) => (
  <div className="sidebar">
    {trains.map(train => (
      <TrainControl
        key={`train-control-${train.id}`}
        train={train}
        updateTrain={dispatchUpdateTrain}
        deleteTrain={dispatchDeleteTrain}
      />
    ))}
  </div>
)

const mapState = (state) => ({
  trains: selectAllTrains(state)
})

const mapDispatch = (dispatch) => ({
  dispatchUpdateTrain: (...args) => dispatch(updateTrain(...args)),
  dispatchDeleteTrain: (...args) => dispatch(deleteTrain(...args))
})

export default connect(mapState, mapDispatch)(Sidebar)
