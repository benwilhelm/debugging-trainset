import React from 'react'
import { connect } from 'react-redux'
import { selectAllEngines, updateEngine } from '../store'
import EngineSpeed from './EngineSpeed'

const Sidebar = ({ engines, dispatchUpdateEngine }) => (
  <div className="sidebar">
    {engines.map(engine => <EngineSpeed key={`throttle-${engine.id}`} onUpdate={(speed) => dispatchUpdateEngine(engine.id, { speed })} value={engine.speed} />)}
  </div>
)

const mapState = (state) => ({
  engines: selectAllEngines(state)
})

const mapDispatch = (dispatch) => ({
  dispatchUpdateEngine: (...args) => dispatch(updateEngine(...args))
})

export default connect(mapState, mapDispatch)(Sidebar)
