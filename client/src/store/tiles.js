import { loop as tiles } from '../data/trackset'
export const UPDATE_TILE = "UPDATE_TILE"
export const INSERT_TILE = "INSERT_TILE"

const initialState = {
  byPosition: tiles.reduce((map, tile) => {
    const index = indexFromPosition(tile.position)
    map.set(index, tile)
    return map
  }, new Map())
}


// ACTION CREATORS
// ====================

export const updateTile = (position, props) => ({
  type: UPDATE_TILE,
  payload:  { ...props, position }
})

export const insertTile = (tile) => ({
  type: INSERT_TILE,
  payload: tile
})


// SELECTORS
// ====================
export const selectTileByPosition = (state, position) => {
  const index = indexFromPosition(position)
  return state.byPosition.get(index)
}

export const selectAllTiles = (state) => {
  return Array.from(state.byPosition.values())
}


// ACTION HANDLERS/REDUCER
// ====================

const actionHandlers = {
  [UPDATE_TILE]: (state, { payload }) => {
    const existingTile = selectTileByPosition(state, payload.position)
    const updatedTile = {...existingTile, ...payload }
    const byPosition = new Map(state.byPosition)
    const index = indexFromPosition(payload.position)
    byPosition.set(index, updatedTile)
    return { ...state, byPosition }
  },

  // because we're using a Map to index the tiles by position, insert
  // and update become the same operation. Neat!
  [INSERT_TILE]: (...args) => actionHandlers[UPDATE_TILE](...args)
}

const reducer = (state=initialState, action) => {
  return actionHandlers.hasOwnProperty(action.type)
       ? actionHandlers[action.type](state, action)
       : state
}




// UTILITY
//==========

export function indexFromPosition([x, y]){
  return `${+x}, ${+y}`
}



export default reducer
