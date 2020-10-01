import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import TrackTile from './TrackTile'
import HoverIndicator from './HoverIndicator'
import Train from './Train'
import useTilePosition from './useTilePosition'
import useZoomableSvg from './useZoomableSvg'
import { COLOR_GRASS } from '../../constants'
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
  stopTrain,
  selectAllTrains,
  selectAllTiles,
} from '../../store'


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
  dispatchTrainTravel,
  dispatchStopTrain,
}) => {

  const { containerEl, svgEl, viewBox, zoomHandler } = useZoomableSvg()
  const { handleMouseMove, tilePosition } = useTilePosition(svgEl)

  useEffect(() => {
    dispatchFetchTiles()
  }, [dispatchFetchTiles])


  useAnimationFrame((deltaTime) => {
    const state = store.getState()
    selectAllTrains(state).forEach(train => {
      const steps = deltaTime/1000 * train.speed
      dispatchTrainTravel(train, steps)
    })
  })


  const zoomFactor = containerEl.current
                   ? containerEl.current.clientWidth / viewBox[2]
                   : 1

  return (
    <div className="playspace" ref={containerEl}>
      <svg ref={svgEl}
           style={{backgroundColor: COLOR_GRASS}}
           viewBox={viewBox.join(' ')} xmlns="http://www.w3.org/2000/svg"
           onMouseMove={handleMouseMove}
           onWheel={zoomHandler}
      >
        <HoverIndicator tilePosition={tilePosition} insertTile={dispatchInsertTile} />
        {tiles.map((tile) => (
          <TrackTile key={tile.position}
            tile={tile}
            toggleSegment={dispatchToggleSegment}
            deleteTile={dispatchDeleteTile}
            rotateTile={dispatchRotateTile}
            insertTrain={dispatchAddTrainToTile}
          />
        ))}

        {trains.map(train => (
          <Train
            key={`train-${train.id}`}
            train={train}
            tiles={tilesByPosition}
            zoomFactor={zoomFactor}
            stopTrain={dispatchStopTrain}
          />))}

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
  dispatchStopTrain: (...args) => dispatch(stopTrain(...args))
})


export default connect(mapState, mapDispatch)(PlaySpace)
