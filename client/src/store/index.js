import { combineReducers, createStore } from 'redux'

import playspaceReducer, {
  selectTileByPosition as selectTileByPositionFromSlice,
  selectTileByCoordinates as selectTileByCoordinatesFromSlice,
  selectAllTiles as selectAllTilesFromSlice,
  selectEngineById as selectEngineFromSlice,
  selectAllEngines as selectAllEnginesFromSlice
} from './playspace'

const rootReducer = combineReducers({
  playspace: playspaceReducer,
})

export default createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export {
  updateTile, deleteTile, toggleSegment, insertTile,
  indexFromPosition, updateEngine, engineTravel
} from './playspace'

export const selectEngineById = (state, id) => selectEngineFromSlice(state.playspace, id)
export const selectAllEngines = (state) => selectAllEnginesFromSlice(state.playspace)

export const selectTileByPosition = (state, position) => selectTileByPositionFromSlice(state.playspace, position)
export const selectTileByCoordinates = (state, coords) => selectTileByCoordinatesFromSlice(state.playspace, coords)
export const selectAllTiles = (state) => selectAllTilesFromSlice(state.playspace)
