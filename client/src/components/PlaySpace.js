import React, { useState, useRef } from 'react'
import TrackTile from './TrackTile'
import HoverIndicator from './HoverIndicator'
import Engine from './Engine'
import EngineSpeed from './EngineSpeed'
import { TILE_WIDTH, TILE_HEIGHT } from '../constants'
import useAnimationFrame from '../hooks/useAnimationFrame'
import store, {
  updateTile,
  toggleTileSegment,
  insertTile,
  deleteTile,
  rotateTile,
  updateEngine,
  engineTravel,
  selectAllEngines,
  selectAllTiles,
  selectTileByPosition,
  selectTileByCoordinates,
} from '../store'
import { connect } from 'react-redux'


function pageCoordsToSvgCoords(pageCoords, svg) {
  const [ pageX, pageY ] = pageCoords
  const pt = svg.createSVGPoint()
  pt.x = pageX
  pt.y = pageY
  const { x, y } = pt.matrixTransform(svg.getScreenCTM().inverse())
  return [ x, y ]
}

const PlaySpace = ({
  tiles,
  engines,
  dispatchUpdateTile,
  dispatchToggleSegment,
  dispatchInsertTile,
  dispatchDeleteTile,
  dispatchRotateTile,
  dispatchUpdateEngine,
  dispatchEngineTravel
}) => {
  const [viewBox, setViewBox] = useState([0, 0, 800, 400])
  const [ tileCoords, setTileCoords ] = useState([0, 0])
  const svgEl = useRef(null)

  const handleMouseMove = (evt) => {
    const [x, y] = pageCoordsToSvgCoords([evt.clientX, evt.clientY], svgEl.current)
    setTileCoords([
      Math.floor(x / TILE_WIDTH),
      Math.floor(y / TILE_HEIGHT)
    ])
  }

  const handleMouseWheel = (e) => {
    const [ pointerX, pointerY ] = pageCoordsToSvgCoords([e.clientX, e.clientY], svgEl.current)
    const [ x, y, w, h ] = viewBox
    const weightX = (pointerX - x) / w
    const weightY = (pointerY - y) / h

    const factor = (e.deltaY > 0)
                 ? 1 + (0.001 * e.deltaY)
                 : 1 - (0.001 * Math.abs(e.deltaY))

    const newW = w * factor
    const newH = h * factor

    const newX = x - ((newW - w) * weightX)
    const newY = y - ((newH - h) * weightY)
    requestAnimationFrame(() => setViewBox([ newX, newY, newW, newH ]))
  }

  useAnimationFrame((deltaTime) => {
    const state = store.getState()
    selectAllEngines(state).forEach(engine => {
      dispatchEngineTravel(engine, deltaTime)
    })
  })

  return (
    <div>
      <svg ref={svgEl}
           style={{border: '1px solid blue'}}
           viewBox={viewBox.join(' ')} xmlns="http://www.w3.org/2000/svg"
           onMouseMove={handleMouseMove}
           onWheel={handleMouseWheel}
      >
        <HoverIndicator tileCoords={tileCoords} insertTile={dispatchInsertTile} />
        {tiles.map((tile) => (
          <TrackTile key={tile.position}
            tile={tile}
            updateTile={dispatchUpdateTile}
            toggleSegment={dispatchToggleSegment}
            deleteTile={dispatchDeleteTile}
            rotateTile={dispatchRotateTile}
          />
        ))}

        {engines.map(engine => <Engine key={`engine-${engine.id}`} coordinates={engine.coordinates} />)}
      </svg>

      {engines.map(engine => <EngineSpeed key={`throttle-${engine.id}`} onUpdate={(speed) => dispatchUpdateEngine(engine.id, { speed })} value={engine.speed} />)}

    </div>
  )
}

const mapState = (state) => ({
  tiles: selectAllTiles(state),
  engines: selectAllEngines(state)
})

const mapDispatch = (dispatch) => ({
  dispatchUpdateTile: (...args) => dispatch(updateTile(...args)),
  dispatchDeleteTile: (...args) => dispatch(deleteTile(...args)),
  dispatchInsertTile: (...args) => dispatch(insertTile(...args)),
  dispatchRotateTile: (...args) => dispatch(rotateTile(...args)),
  dispatchToggleSegment: (...args) => dispatch(toggleTileSegment(...args)),
  dispatchUpdateEngine: (...args) => dispatch(updateEngine(...args)),
  dispatchEngineTravel: (...args) => dispatch(engineTravel(...args)),
})


export default connect(mapState, mapDispatch)(PlaySpace)
