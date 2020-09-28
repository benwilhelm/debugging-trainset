import React from 'react'
import { connect } from 'react-redux'
import { selectAllEngines, updateEngine, deleteEngine } from '../../store'
import EngineControl from './EngineControl'
import './index.css'

const Sidebar = ({ engines, dispatchUpdateEngine, dispatchDeleteEngine }) => (
  <div className="sidebar">
    {engines.map(engine => (
      <EngineControl
        key={`engine-control-${engine.id}`}
        engine={engine}
        updateEngine={dispatchUpdateEngine}
        deleteEngine={dispatchDeleteEngine}
      />
    ))}
  </div>
)

const mapState = (state) => ({
  engines: selectAllEngines(state)
})

const mapDispatch = (dispatch) => ({
  dispatchUpdateEngine: (...args) => dispatch(updateEngine(...args)),
  dispatchDeleteEngine: (...args) => dispatch(deleteEngine(...args))
})

export default connect(mapState, mapDispatch)(Sidebar)
