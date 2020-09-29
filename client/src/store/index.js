import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import playspaceReducer, {
  selectTileByPosition as selectTileByPositionFromSlice,
  selectTileByCoordinates as selectTileByCoordinatesFromSlice,
  selectAllTiles as selectAllTilesFromSlice,
  selectTrainById as selectTrainFromSlice,
  selectAllTrains as selectAllTrainsFromSlice
} from './playspace'

const rootReducer = combineReducers({
  playspace: playspaceReducer,
})

export default createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
)

export {
  updateTile, deleteTile, toggleTileSegment, insertTile, rotateTile,
  fetchTiles, persistTileAction, addTrainToTile,
  updateTrain, trainTravel, deleteTrain, stopTrain, addCarToTrain, removeCarFromTrain
} from './playspace'

export const selectTrainById = (state, id) => selectTrainFromSlice(state.playspace, id)
export const selectAllTrains = (state) => selectAllTrainsFromSlice(state.playspace)

export const selectTileByPosition = (state, position) => selectTileByPositionFromSlice(state.playspace, position)
export const selectTileByCoordinates = (state, coords) => selectTileByCoordinatesFromSlice(state.playspace, coords)
export const selectAllTiles = (state) => selectAllTilesFromSlice(state.playspace)
