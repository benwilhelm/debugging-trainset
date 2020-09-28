import { TILE_WIDTH, TILE_HEIGHT } from '../constants'
import Tile from '../models/Tile'
import Engine from '../models/Engine'
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

export const engineTravel = (engine, steps) => ({
  type: ENGINE_TRAVEL,
  payload: { engine, steps }
})

export const stopEngine = (engineId) => ({
  type: UPDATE_ENGINE,
  payload: { id: engineId, speed: 0 }
})

export const addEngineToTile = (tile) => {
  return {
    type: INSERT_ENGINE,
    payload: {
      tilePosition: tile.position,
      entryPoint: tile.from,
      step: 10,
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
    const {engine, steps} = payload
    const {
      tilePosition,
      step,
      entryPoint,
      speed,
    } = getDestinationTile(engine, steps, state.tiles)


    return {...state, engines: {
      ...state.engines,
      [engine.id]: new Engine({
        ...engine,
        step,
        tilePosition,
        entryPoint,
        speed
      })
    }}
    // const tile = selectTileByCoordinates(state, engine.coordinates)
    // const step = engine.step + (deltaTime/1000 * engine.speed)
    // const referencePoint = engine.entryPoint || tile.closestEntryPoint(engine.coordinates)
    // const nextEnginePosition = tile.travelFunction(step, referencePoint)
    // const nextCoordinates = nextEnginePosition.point
    // const nextRotation = nextEnginePosition.rotation
    // if (step > tile.totalSteps || step < 0) {
    //   const nextTile = selectTileByCoordinates(state, nextCoordinates)
    //   if (!nextTile) {
    //     return reducer(state, stopEngine(engine.id))
    //   }
    //
    //   const nextReferencePoint = nextTile.getReferencePoint(nextCoordinates, engine.speed)
    //   if (!nextReferencePoint) {
    //     return reducer(state, stopEngine(engine.id))
    //   }
    //
    //   return reducer(state, updateEngine(engine.id, {
    //     id: engine.id,
    //     coordinates: nextCoordinates,
    //     rotation: nextRotation,
    //     entryPoint: nextReferencePoint,
    //     step: (step > 0) ? step - tile.totalSteps
    //                      : nextTile.totalSteps - step
    //   }))
    // }
    //
    // return actionHandlers[UPDATE_ENGINE](state, { payload: {
    //   id: engine.id,
    //   coordinates: nextCoordinates,
    //   rotation: nextRotation,
    //   entryPoint: referencePoint,
    //   step
    // }})
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


export function getDestinationTile(engine, steps, tiles) {
  const { step, entryPoint, tilePosition, speed } = engine
  const tile = tiles[tilePosition.toString()]
  const destStep = step + steps

  if (destStep >=0 && destStep < tile.totalSteps) {
    return { step: destStep, entryPoint, tilePosition, speed}
  }


  const forward = (destStep >= 0)
  const nextTilePosition = (forward)
                         ? tile.nextTilePosition(entryPoint)
                         : tile.previousTilePosition(entryPoint)
  const nextTile = tiles[nextTilePosition.toString()]
  if (!nextTile) {
    return {
      step: (forward) ? tile.totalSteps : 0,
      speed: 0,
      entryPoint,
      tilePosition,
    }
  }

  const borderStep = (forward) ? tile.totalSteps + 1 : -1
  const { point: borderCoords } = tile.travelFunction(borderStep, entryPoint)
  const nextEntryPoint = nextTile.getReferencePoint(borderCoords, speed)
  if (!nextEntryPoint) {
    return {
      step: (forward) ? tile.totalSteps : 0,
      speed: 0,
      entryPoint,
      tilePosition,
    }
  }


  const engineParams = {
    step: 0,
    entryPoint: nextEntryPoint,
    tilePosition: nextTilePosition,
    speed
  }
  const newDestStep = (forward)
                    ? destStep - tile.totalSteps
                    : nextTile.totalSteps + destStep // destStep is negative here
  return getDestinationTile(engineParams, newDestStep, tiles)
}
