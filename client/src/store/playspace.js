import { TILE_WIDTH, TILE_HEIGHT } from '../constants'
import { branching as trackset } from '../data/trackset'
import { coordinatesInSameTile } from '../util'
import Tile from '../models/tile'

export const UPDATE_ENGINE = "UPDATE_ENGINE"
export const ENGINE_TRAVEL = "ENGINE_TRAVEL"
export const UPDATE_TILE = "UPDATE_TILE"
export const INSERT_TILE = "INSERT_TILE"
export const DELETE_TILE = "DELETE_TILE"
export const TOGGLE_SEGMENT = "TOGGLE_SEGMENT"



const initialState = {
  engines: trackset.engines.reduce((map, engine) => {
    map[engine.id] = engine
    return map
  }, {}),

  tiles: trackset.tiles.reduce((map, tile) => {
    const index = tile.position.toString()
    map[index] = new Tile(tile)
    return map
  }, {})
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

export const stopEngine = (engineId) => ({
  type: UPDATE_ENGINE,
  payload: { id: engineId, speed: 0 }
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
    return { ...state, engines: {
      ...state.engines,
      [payload.id]: updatedEngine
    } }
  },
  [ENGINE_TRAVEL]: (state, {payload}) => {
    const {engine, deltaTime} = payload
    const tile = selectTileByCoordinates(state, engine.coordinates)
    const step = engine.step + (deltaTime/1000 * engine.speed)
    const referencePoint = engine.entryPoint || tile.closestEntryPoint(engine.coordinates)
    const nextCoordinates = tile.travelFunction(step, referencePoint)
    if (step > tile.totalSteps || step < 0) {
      const nextTile = selectTileByCoordinates(state, nextCoordinates)
      if (!nextTile) {
        return reducer(state, stopEngine(engine.id))
      }

      const nextReferencePoint = nextTile.getReferencePoint(nextCoordinates, engine.speed)
      if (!nextReferencePoint) {
        return reducer(state, stopEngine(engine.id))
      }

      return reducer(state, updateEngine(engine.id, {
        id: engine.id,
        coordinates: nextCoordinates,
        entryPoint: nextReferencePoint,
        step: (step > 0) ? step - tile.totalSteps
                         : nextTile.totalSteps - step
      }))
    }

    return actionHandlers[UPDATE_ENGINE](state, { payload: {
      id: engine.id,
      coordinates: nextCoordinates,
      entryPoint: referencePoint,
      step
    }})
  },

  [UPDATE_TILE]: (state, { payload }) => {
    const existingTile = selectTileByPosition(state, payload.position)
    const updatedTile = new Tile({...existingTile, ...payload })
    const index = updatedTile.position.toString()
    const tiles = { ...state.tiles, [index]: updatedTile}
    return { ...state, tiles }
  },

  [INSERT_TILE]: (state, { payload }) => {
    const tile = new Tile(payload)
    const index = tile.position.toString()
    const tiles = { ...state.tiles, [index]: tile }
    return {...state, tiles }
  },

  [TOGGLE_SEGMENT]: (state, { payload }) => {
    const tile = selectTileByPosition(state, payload.position)
    tile.selectedSegment = (tile.selectedSegment >= tile.segments.length - 1) ? 0
                         : tile.selectedSegment + 1
    return actionHandlers[UPDATE_TILE](state, { payload: tile })
  },
  [DELETE_TILE]: (state, { payload }) => {
    const tile = payload
    const index = indexFromPosition(tile.position)
    const { index:deleted, ...tiles } = state.tiles
    return { ...state, tiles }
  }

}

export default function reducer(state=initialState, action) {
  return actionHandlers.hasOwnProperty(action.type)
       ? actionHandlers[action.type](state, action)
       : state
}


// SELECTORS
// ===================

export function selectEngineById(state, id) {
  return state.engines[id]
}

export function selectAllEngines(state) {
  return Object.values(state.engines)
}

export const selectTileByPosition = (state, position) => {
  return state.tiles[position.toString()]
}

export const selectTileByCoordinates = (state, [x, y]) => {
  const position = [
    Math.floor(x / TILE_WIDTH),
    Math.floor(y / TILE_HEIGHT)
  ]
  return selectTileByPosition(state, position)
}

export const selectAllTiles = (state) => {
  return Object.values(state.tiles)
}



// UTILITY
//==========

export function indexFromPosition([x, y]){
  return `${+x}, ${+y}`
}
