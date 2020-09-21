import React, { useState, useRef } from 'react'
import TrackTile from './TrackTile'
import HoverIndicator from './HoverIndicator'
import Engine from './Engine'
import EngineSpeed from './EngineSpeed'
import { TILE_WIDTH, TILE_HEIGHT } from '../constants'
import useAnimationFrame from '../hooks/useAnimationFrame'
import store, {
  updateTile,
  insertTile,
  updateEngine,
  indexFromPosition,
  selectAllEngines,
  selectAllTiles,
  selectTileByPosition
} from '../store'
import { connect } from 'react-redux'

const travelTransform = (tile, [x, y]) => {
  const [ax, ay] = [TILE_WIDTH/2, TILE_HEIGHT/2]
  const rotated = (tile.rotation ===  90) ? [ -(y-ay) + ax,  (x-ax) + ay ]
                : (tile.rotation === 180) ? [ -(x-ax) + ax, -(y-ay) + ay ]
                : (tile.rotation === 270) ? [  (y-ay) + ax, -(x-ax) + ay ]
                : [x, y]
  return [
    rotated[0] + tile.position[0] * TILE_WIDTH,
    rotated[1] + tile.position[1] * TILE_HEIGHT
  ]
}

const reflectOver = (val, reflector) => {
  const diff = reflector - val
  return val + (2*diff)
}

const travelFunctions = {
  STRAIGHT: (tile, entryPoint, currentPosition) => {
    return (entryPoint === "negY") ? (step) => travelTransform(tile, [TILE_WIDTH / 2, step])
         : (entryPoint === "posY") ? (step) => travelTransform(tile, [TILE_WIDTH / 2, reflectOver(step, TILE_HEIGHT / 2)])
         : (step) => currentPosition

  },
  CURVE: (tile, entryPoint, currentPosition) => {
    if (entryPoint === "posY" || entryPoint === "posX")
      return (step) => currentPosition


    return (step) => {
      const r = TILE_WIDTH/2
      const circumference = 2 * Math.PI * r
      const totalSteps = circumference / 4

      if (entryPoint === "negX") {
        step = reflectOver(step, totalSteps/2)
      }

      const radPerStep = (Math.PI / 2) / totalSteps
      const theta = step * radPerStep

      return travelTransform(tile, [
        r * Math.cos(theta),
        r * Math.sin(theta)
      ])
    }
  }
}

function getTravelFunction(tile, currentPosition) {
  const baseFunc = travelFunctions[tile.type]
  if (!baseFunc)
    return (step) => step

  const tileMidpoint = [
    (tile.position[0] * TILE_WIDTH) + (TILE_WIDTH/2),
    (tile.position[1] * TILE_HEIGHT) + (TILE_HEIGHT/2),
  ]

  const rise = currentPosition[1] - tileMidpoint[1]
  const run  = currentPosition[0] - tileMidpoint[0]
  const orientation = Math.abs(rise) > Math.abs(run) ? "Y" : "X"

  const borders = ["negY", "posX", "posY", "negX"]
  const closestBorderIndex = (orientation === "X" && run > 0) ? 1
                      : (orientation === "X" && run <= 0) ? 3
                      : (orientation === "Y" && rise < 0) ? 0
                      : 2

  let adjustedIndex = closestBorderIndex - (tile.rotation / 90)
  if (adjustedIndex < 0) {
    adjustedIndex += 4
  }
  const entryPoint = borders[adjustedIndex]

  return travelFunctions[tile.type](tile, entryPoint, currentPosition)
}


function pageCoordsToSvgCoords(pageCoords, svg) {
  const [ pageX, pageY ] = pageCoords
  const pt = svg.createSVGPoint()
  pt.x = pageX
  pt.y = pageY
  const { x, y } = pt.matrixTransform(svg.getScreenCTM().inverse())
  return [ x, y ]
}

const PlaySpace = ({ tiles, engines, dispatchUpdateTile, dispatchInsertTile, dispatchUpdateEngine }) => {
  const [viewBox, setViewBox] = useState([0, 0, 800, 400])
  const [ tileCoords, setTileCoords ] = useState([0, 0])
  const svgEl = useRef(null)
  const tilePosition = useRef({ tileId: null, step: 0 })

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
      const [ x, y ] = engine.coordinates
      const tileCoords = [
        Math.floor(x / TILE_WIDTH),
        Math.floor(y / TILE_HEIGHT)
      ]


      const overTile = selectTileByPosition(state, tileCoords)
      if (!overTile) {
        return [ x, y ]
      }

      if (tilePosition.current.tileId !== overTile.id) {
        tilePosition.current = {
          tileId: overTile.id,
          travelFunction: getTravelFunction(overTile, [x, y]),
          step: 0
        }
      }

      tilePosition.current.step += (deltaTime / 1000) * engine.speed
      const newCoordinates = tilePosition.current.travelFunction(tilePosition.current.step)
      dispatchUpdateEngine(engine.id, { coordinates: newCoordinates })
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
          <TrackTile key={tile.position} {...tile} updateTile={dispatchUpdateTile} />
        ))}

        {engines.map(engine => <Engine key={engine.id} coordinates={engine.coordinates} />)}
      </svg>

      {engines.map(engine => <EngineSpeed key={engine.id} onUpdate={(speed) => dispatchUpdateEngine(engine.id, { speed })} value={engine.speed} />)}

    </div>
  )
}

const mapState = (state) => ({
  tiles: Array.from(state.tiles.byPosition.values()),
  engines: Array.from(state.engines.byId.values())
})

const mapDispatch = (dispatch) => ({
  dispatchUpdateTile: (...args) => dispatch(updateTile(...args)),
  dispatchInsertTile: (...args) => dispatch(insertTile(...args)),
  dispatchUpdateEngine: (...args) => dispatch(updateEngine(...args)),
})


export default connect(mapState, mapDispatch)(PlaySpace)
