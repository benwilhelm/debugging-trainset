import React, { useState, useRef, useEffect } from 'react'
import TrackTile from './TrackTile'
import HoverIndicator from './HoverIndicator'
import Train from './Train'
import { TILE_WIDTH, TILE_HEIGHT, COLOR_GRASS } from '../../constants'
import useAnimationFrame from '../../hooks/useAnimationFrame'
import store, {
  toggleTileSegment,
  insertTile,
  deleteTile,
  rotateTile,
  fetchTiles,
  persistTileAction,
  addTrainToTile,
  trainTravel,
  selectAllTrains,
  selectAllTiles,
} from '../../store'
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
  tilesByPosition,
  trains,
  dispatchToggleSegment,
  dispatchInsertTile,
  dispatchDeleteTile,
  dispatchRotateTile,
  dispatchFetchTiles,
  dispatchAddTrainToTile,
  dispatchUpdateTrain,
  dispatchTrainTravel
}) => {

  const containerEl = useRef(null)
  const svgEl = useRef(null)

  const [viewBox, setViewBox] = useState([0, 0, 800, 400 ])
  const [ tileCoords, setTileCoords ] = useState([0, 0])

  useEffect(() => {
    dispatchFetchTiles()
  }, [dispatchFetchTiles])

  const handleMouseMove = (evt) => {
    const [x, y] = pageCoordsToSvgCoords([evt.clientX, evt.clientY], svgEl.current)
    setTileCoords([
      Math.floor(x / TILE_WIDTH),
      Math.floor(y / TILE_HEIGHT)
    ])
  }

  const handleMouseWheel = (e) => {
    const [ pointerX, pointerY ] = pageCoordsToSvgCoords([e.clientX, e.clientY], svgEl.current)
    const factor = (e.deltaY > 0)
                 ? 1 + (0.001 * e.deltaY)
                 : 1 - (0.001 * Math.abs(e.deltaY))

    requestAnimationFrame(() => setViewBox(([x, y, w, h]) => {
      const weightX = (pointerX - x) / w
      const weightY = (pointerY - y) / h

      const newW = w * factor
      const newH = h * factor

      const newX = x - ((newW - w) * weightX)
      const newY = y - ((newH - h) * weightY)

      return [ newX, newY, newW, newH ]
    }))
  }

  useAnimationFrame((deltaTime) => {
    const state = store.getState()
    selectAllTrains(state).forEach(train => {
      const steps = deltaTime/1000 * train.speed
      dispatchTrainTravel(train, steps)
    })
  })

  useEffect(() => {
    const updateViewBoxAspect = () => {
      const aspect = containerEl.current
                   ? containerEl.current.clientWidth / containerEl.current.clientHeight
                   : 2 / 1
      setViewBox(([ x, y, w, h]) => ([x, y, w, w/aspect]), [])
    }

    updateViewBoxAspect()
    window.addEventListener('resize', updateViewBoxAspect)

    return () => window.removeEventListener('resize', updateViewBoxAspect)
  }, [])

  const zoomFactor = containerEl.current
                   ? containerEl.current.clientWidth / viewBox[2]
                   : 1

  return (
    <div className="playspace" ref={containerEl}>
      <svg ref={svgEl}
           style={{backgroundColor: COLOR_GRASS}}
           viewBox={viewBox.join(' ')} xmlns="http://www.w3.org/2000/svg"
           onMouseMove={handleMouseMove}
           onWheel={handleMouseWheel}
      >
        <HoverIndicator tileCoords={tileCoords} insertTile={dispatchInsertTile} />
        {tiles.map((tile) => (
          <TrackTile key={tile.position}
            tile={tile}
            toggleSegment={dispatchToggleSegment}
            deleteTile={dispatchDeleteTile}
            rotateTile={dispatchRotateTile}
            insertTrain={dispatchAddTrainToTile}
          />
        ))}

        {trains.map(train => <Train train={train} tiles={tilesByPosition} zoomFactor={zoomFactor} />)}

      </svg>
    </div>

  )
}

const mapState = (state) => ({
  tiles: selectAllTiles(state),
  tilesByPosition: state.playspace.tiles,
  trains: selectAllTrains(state)
})

const mapDispatch = (dispatch) => ({
  dispatchDeleteTile: (tile) => dispatch(persistTileAction(tile, deleteTile)),
  dispatchInsertTile: (tile) => dispatch(persistTileAction(tile, insertTile)),
  dispatchRotateTile: (tile) => dispatch(persistTileAction(tile, rotateTile)),
  dispatchAddTrainToTile: (tile) => dispatch(addTrainToTile(tile)),
  dispatchFetchTiles: (...args) => dispatch(fetchTiles(...args)),
  dispatchToggleSegment: (...args) => dispatch(toggleTileSegment(...args)),
  dispatchTrainTravel: (...args) => dispatch(trainTravel(...args)),
})


export default connect(mapState, mapDispatch)(PlaySpace)
