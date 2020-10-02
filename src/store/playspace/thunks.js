import { saveTileData, loadTileData } from '../../services/persistence'
import { loadTiles } from './actions'

export const persistTiles = () => async (dispatch, getState) => {
  const tiles = Object.values(getState().playspace.tiles)
  await saveTileData(tiles)
}

export const persistTileAction = (tile, actionCreator) => async (dispatch) => {
  try {
    dispatch(actionCreator(tile))
    return dispatch(persistTiles())
  } catch (err) {
    throw err
  }
}

export const fetchTiles = () => async (dispatch) => {
  const tiles = (await loadTileData()) || []
  dispatch(loadTiles(tiles))
}
