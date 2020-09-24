import { TILE_WIDTH, TILE_HEIGHT } from '../constants'
import Tile from '../models/tile'
import Engine from '../models/engine'
import { saveTileData, loadTileData } from '../services/persistence'

export const UPDATE_ENGINE = "UPDATE_ENGINE"
export const ENGINE_TRAVEL = "ENGINE_TRAVEL"
export const INSERT_ENGINE = "INSERT_ENGINE"

export const UPDATE_TILE = "UPDATE_TILE"
export const INSERT_TILE = "INSERT_TILE"
export const DELETE_TILE = "DELETE_TILE"
export const LOAD_TILES = "LOAD_TILES"
export const TOGGLE_SEGMENT = "TOGGLE_SEGMENT"



const initialState = {
  engines: {},
  tiles: {}
}

// ACTION CREATORS
// ====================

export const updateEngine = (id, props) => ({
  type: UPDATE_ENGINE,
  payload: { ...props, id }
})

export const engineTravel = (engine, deltaTime) => ({
  type: ENGINE_TRAVEL,
  payload: { engine, deltaTime }
})

export const stopEngine = (engineId) => ({
  type: UPDATE_ENGINE,
  payload: { id: engineId, speed: 0 }
})

export const addEngineToTile = (tile) => {
  return {
    type: INSERT_ENGINE,
    payload: {
      coordinates: tile.travelFunction(10, tile.from),
      step: 10,
      // entryPoint: tile.from
    }
  }
}

export const persistTiles = () => async (dispatch, getState) => {
  const tiles = Object.values(getState().playspace.tiles)
  await saveTileData(tiles)
}

export const persistTileAction = (tile, actionCreator) => async (dispatch) => {
  dispatch(actionCreator(tile))
  return dispatch(persistTiles())
}

export const fetchTiles = () => async (dispatch) => {
  const tiles = (await loadTileData()) || []
  dispatch(loadTiles(tiles))
}

export const updateTile = (tile) => ({
  type: UPDATE_TILE,
  payload: tile
})

export const rotateTile = (tile) => ({
  type: UPDATE_TILE,
  payload: {
    position: tile.position,
    rotation: (tile.rotation + 90) % 360
  }
})

export const toggleTileSegment = (tile) => ({
  type: UPDATE_TILE,
  payload: {
    position: tile.position,
    selectedSegment: tile.selectedSegment < tile.segments.length - 1
                   ? tile.selectedSegment + 1
                   : 0
  }
})

export const insertTile = (tile) => ({
  type: INSERT_TILE,
  payload: tile
})

export const deleteTile = (tile) => ({
  type: DELETE_TILE,
  payload: tile
})

export const loadTiles = (tiles) => ({
  type: LOAD_TILES,
  payload: tiles
})


const actionHandlers = {
  [INSERT_ENGINE]: (state, { payload }) => {
    const engine = new Engine(payload)
    const engines = { ...state.engines }
    engines[engine.id] = engine
    return { ...state, engines }
  },
  [UPDATE_ENGINE]: (state, {payload}) => {
    const existingEngine = selectEngineById(state, payload.id)
    const updatedEngine = new Engine({ ...existingEngine, ...payload })
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

  [DELETE_TILE]: (state, { payload }) => {
    const tile = payload
    const index = tile.position.toString()
    const tiles = {...state.tiles}
    delete tiles[index]
    return { ...state, tiles }
  },

  [LOAD_TILES]: (state, { payload }) => {
    const tiles = payload.reduce((map, tile) => {
      const index = tile.position.toString()
      map[index] = new Tile(tile)
      return map
    }, {})
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
