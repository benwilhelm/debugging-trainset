import { TILE_WIDTH, TILE_HEIGHT } from '../constants'
import { straight as tiles } from '../data/trackset'
import { coordinatesInSameTile } from '../util'
import Tile from '../models/tile'

export const UPDATE_ENGINE = "UPDATE_ENGINE"
export const ENGINE_TRAVEL = "ENGINE_TRAVEL"
export const UPDATE_TILE = "UPDATE_TILE"
export const INSERT_TILE = "INSERT_TILE"
export const DELETE_TILE = "DELETE_TILE"
export const TOGGLE_SEGMENT = "TOGGLE_SEGMENT"

const initialState = {
  engines: new Map([
    ["A", { id: "A", coordinates: [ 240, 110 ], speed: 0, step: 0 }]
  ]),

  tiles: tiles.reduce((map, tile) => {
    const index = tile.position.toString()
    map.set(index, new Tile(tile))
    return map
  }, new Map())
}

// ACTION CREATORS
// ====================

export const updateEngine = (id, props) => ({
  type: UPDATE_ENGINE,
  payload: { ...props, id }
})

export const engineTravel = (engine, deltaTime) => ({
  type: ENGINE_TRAVEL,
  payload: { engine, deltaTime}
})

export const updateTile = (position, props) => ({
  type: UPDATE_TILE,
  payload:  { ...props, position }
})

export const toggleSegment = (position) => ({
  type: TOGGLE_SEGMENT,
  payload: { position }
})

export const insertTile = (tile) => ({
  type: INSERT_TILE,
  payload: tile
})

export const deleteTile = (tile) => ({
  type: DELETE_TILE,
  payload: tile
})


const actionHandlers = {
  [UPDATE_ENGINE]: (state, {payload}) => {
    const existingEngine = selectEngineById(state, payload.id)
    const updatedEngine = { ...existingEngine, ...payload }
    const engines = new Map(state.engines)
    engines.set(payload.id, updatedEngine)
    return { ...state, engines }
  },
  [ENGINE_TRAVEL]: (state, {payload}) => {
    const {engine, deltaTime} = payload
    const tile = selectTileByCoordinates(state, engine.coordinates)
    const referencePoint = engine.entryPoint || tile.getReferencePoint(engine.coordinates, engine.speed)
    const step = engine.step + ((deltaTime/1000) * engine.speed)
    const nextCoordinates = tile.travelFunction(step, referencePoint)
    const nextTile = selectTileByCoordinates(state, nextCoordinates)
    if (!nextTile) {
      return actionHandlers[UPDATE_ENGINE](state, { payload: {
        id: engine.id,
        speed: 0
      }})
    }

    if (tile.id === nextTile.id) {
      return actionHandlers[UPDATE_ENGINE](state, { payload: {
        id: engine.id,
        coordinates: nextCoordinates,
        step,
      }})
    }

    const nextReferencePoint = nextTile.getReferencePoint(nextCoordinates, engine.speed)
    if (!nextReferencePoint) {
      return actionHandlers[UPDATE_ENGINE](state, { payload: {
        id: engine.id,
        speed: 0
      }})
    }

    return actionHandlers[UPDATE_ENGINE](state, { payload: {
      id: engine.id,
      coordinates: nextCoordinates,
      entryPoint: nextReferencePoint,
      step: 0,
    }})
  },

  [UPDATE_TILE]: (state, { payload }) => {
    const existingTile = selectTileByPosition(state, payload.position)
    const updatedTile = new Tile({...existingTile, ...payload })
    const index = updatedTile.position.toString()
    const tiles = new Map(state.tiles)
    tiles.set(index, updatedTile)
    return { ...state, tiles }
  },

  // because we're using a Map to index the tiles by position, insert
  // and update become the same operation. Neat!
  [INSERT_TILE]: (...args) => actionHandlers[UPDATE_TILE](...args),

  [TOGGLE_SEGMENT]: (state, { payload }) => {
    const tile = selectTileByPosition(state, payload.position)
    tile.selectedSegment = (tile.selectedSegment >= tile.segments.length - 1) ? 0
                         : tile.selectedSegment + 1
    return actionHandlers[UPDATE_TILE](state, { payload: tile })
  },
  [DELETE_TILE]: (state, { payload }) => {
    const tile = payload
    const index = indexFromPosition(tile.position)
    const tiles = new Map(state.tiles)
    tiles.delete(index)
    return { ...state, tiles }
  }

}

const reducer = (state=initialState, action) => {
  return actionHandlers.hasOwnProperty(action.type)
       ? actionHandlers[action.type](state, action)
       : state
}


// SELECTORS
// ===================

export function selectEngineById(state, id) {
  return state.engines.get(id)
}

export function selectAllEngines(state) {
  return Array.from(state.engines.values())
}

export const selectTileByPosition = (state, position) => {
  return state.tiles.get(position.toString())
}

export const selectTileByCoordinates = (state, [x, y]) => {
  const position = [
    Math.floor(x / TILE_WIDTH),
    Math.floor(y / TILE_HEIGHT)
  ]
  return selectTileByPosition(state, position)
}

export const selectAllTiles = (state) => {
  return Array.from(state.tiles.values())
}

export default reducer



// UTILITY
//==========

export function indexFromPosition([x, y]){
  return `${+x}, ${+y}`
}
