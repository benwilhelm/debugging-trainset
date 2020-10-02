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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk),
  )
)

export {
  updateTile, deleteTile, toggleTileSegment, insertTile, rotateTile,
  fetchTiles, persistTileAction, addTrainToTile,
  updateTrain, trainTravel, deleteTrain, stopTrain, addCarToTrain, removeCarFromTrain,
  getDestinationTile
} from './playspace'

export const selectTrainById = (state, id) => selectTrainFromSlice(state.playspace, id)
export const selectAllTrains = (state) => selectAllTrainsFromSlice(state.playspace)

export const selectTileByPosition = (state, position) => selectTileByPositionFromSlice(state.playspace, position)
export const selectTileByCoordinates = (state, coords) => selectTileByCoordinatesFromSlice(state.playspace, coords)
export const selectAllTiles = (state) => selectAllTilesFromSlice(state.playspace)
