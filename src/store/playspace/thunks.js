/**
 * The functions in this file deal with any asynchronous logic that might
 * be dispatched. In our case, that is anything related to persisting the
 * tiles using the persistence service located at src/services/persistence
 */

import { saveTileData, loadTileData } from '../../services/persistence'
import { loadTiles } from './actions'

/**
 * An asynchronous action to save the current tiles to our persistence layer
 */
export const persistTiles = () => async (dispatch, getState) => {
  const tiles = Object.values(getState().playspace.tiles)
  await saveTileData(tiles)
}

/**
 * This is a wrapper function that allows us to persist the result of
 * a dispatched Tile action if it succeeds, or throws an error if it does not.
 */
export const persistTileAction = (tile, actionCreator) => async (dispatch) => {
  dispatch(actionCreator(tile))
  return dispatch(persistTiles())
}

/**
 * Fetches the tile state from our persistence layer (services/persistence)
 * and loads the result into the Redux store
 */
export const fetchTiles = () => async (dispatch) => {
  const tiles = (await loadTileData()) || []
  dispatch(loadTiles(tiles))
}
