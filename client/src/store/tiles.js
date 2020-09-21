import { loop as tiles } from '../data/trackset'
import { TILE_WIDTH, TILE_HEIGHT } from '../constants'
export const UPDATE_TILE = "UPDATE_TILE"
export const INSERT_TILE = "INSERT_TILE"

const initialState = {
  byPosition: tiles.reduce((map, tile) => {
    const index = indexFromPosition(tile.position)
    tile.travelFunctions = generateTravelFunctions(tile)
    tile.id = index
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
    updatedTile.travelFunctions = generateTravelFunctions(updatedTile)
    const byPosition = new Map(state.byPosition)
    const index = indexFromPosition(payload.position)
    updatedTile.id = updatedTile.id || index
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
export default reducer




// UTILITY
//==========

export function indexFromPosition([x, y]){
  return `${+x}, ${+y}`
}

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


function generateTravelFunctions(tile) {
  switch (tile.type) {
    case "STRAIGHT":
      return ({
        'posX': (step, currentPosition) => currentPosition,
        'negX': (step, currentPosition) => currentPosition,
        'posY': (step, currentPosition) => travelTransform(tile, [TILE_WIDTH / 2, reflectOver(step, TILE_HEIGHT / 2)]),
        'negY': (step, currentPosition) => travelTransform(tile, [TILE_WIDTH / 2, step]),
      })

    case "CURVE":
      const r = TILE_WIDTH/2
      const circumference = 2 * Math.PI * r
      const totalSteps = circumference / 4
      const radPerStep = (Math.PI / 2) / totalSteps

      const pointFromStep = (step) => {
        const theta = step * radPerStep
        return travelTransform(tile, [
          r * Math.cos(theta),
          r * Math.sin(theta)
        ])
      }

      return ({
        'posY': (step, currentPosition) => currentPosition,
        'posX': (step, currentPosition) => currentPosition,
        'negY': (step, currentPosition) => {
          return pointFromStep(step)
        },
        'negX': (step, currentPosition) => {
          step = reflectOver(step, totalSteps/2)
          return pointFromStep(step)
        }
      })
  }
}
