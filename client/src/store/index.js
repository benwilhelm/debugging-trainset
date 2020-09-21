import { combineReducers, createStore } from 'redux'

import tilesReducer, {
  selectTileByPosition as selectTileFromSlice,
  selectAllTiles as selectAllTilesFromSlice
} from './tiles'
import enginesReducer, {
  selectEngineById as selectEngineFromSlice,
  selectAllEngines as selectAllEnginesFromSlice
} from './engines'

const rootReducer = combineReducers({
  tiles: tilesReducer,
  engines: enginesReducer
})

export default createStore(rootReducer)

export { updateTile, insertTile, indexFromPosition } from './tiles'
export { updateEngine, engineTravel } from './engines'

export const selectEngineById = (state, id) => selectEngineFromSlice(state.engines, id)
export const selectAllEngines = (state) => selectAllEnginesFromSlice(state.engines)

export const selectTileByPosition = (state, position) => selectTileFromSlice(state.tiles, position)
export const selectAllTiles = (state) => selectAllTilesFromSlice(state.tiles)
