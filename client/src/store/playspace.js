import { TILE_WIDTH, TILE_HEIGHT } from '../constants'
import Tile from '../models/Tile'
import Engine from '../models/Engine'
import { tilePositionFromCoordinates } from '../util'
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
  const { point, rotation } = tile.travelFunction(10, tile.from)
  return {
    type: INSERT_ENGINE,
    payload: {
      step: 10,
      coordinates: point,
      rotation,
      entryPoint: tile.from
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
    const steps = deltaTime/1000 * engine.speed
    const { speed, location, entryPoint, step } = getNextLocation(engine, state.tiles, steps)
    return reducer(state, updateEngine({
      id: engine.id,
      coordinates: location.point,
      rotation: location.rotation,
      speed,
      entryPoint,
      step
    }))



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

export function getNextLocation(car, tiles, steps) {
  const currentTileIndex = tilePositionFromCoordinates(car.coordinates).toString()
  console.log(currentTileIndex, steps)
  const currentTile = tiles[currentTileIndex]

  // in same tile
  if (
    (steps === 0)
    || (steps > 0 && steps < currentTile.totalSteps)
    || (steps < 0 && Math.abs(steps) <= car.step)
  ) {
    return {
      location: currentTile.travelFunction(car.step + steps, car.entryPoint),
      speed: car.speed,
      entryPoint: car.entryPoint,
      step: car.step + steps
    }
  }

  // forward, beyond current tile
  if (steps > 0 && steps + car.step > currentTile.totalSteps) {
    const stepsInTile = currentTile.totalSteps - car.step
    const stepsBeyondTile = steps - stepsInTile
    const nextTileLocation = currentTile.travelFunction(currentTile.totalSteps, car.entryPoint)
    const nextTileIndex = tilePositionFromCoordinates(nextTileLocation.point).toString()
    const nextTile = tiles[nextTileIndex]
    const nextEntryPoint = nextTile.getReferencePoint(nextTileLocation.point, car.speed)
    if (!nextEntryPoint)
      return {
        location: currentTile.travelFunction(currentTile.totalSteps, car.entryPoint),
        speed: 0,
        entryPoint: car.entryPoint
      }

    return getNextLocation({
      ...car,
      step: 0,
      entryPoint: nextEntryPoint,
      coordinates: nextTileLocation.point,
      rotation: nextTileLocation.rotation
    }, tiles, stepsBeyondTile)
  }

  // backward, beyond current tile
  if (car.step + steps < 0) {
    const stepsBeyondTile = car.step + steps

    const throwAway = currentTile.travelFunction(-1, car.entryPoint)
    const nextTileIndex = tilePositionFromCoordinates(throwAway.point).toString()
    const nextTile = tiles[nextTileIndex]
    const nextEntryPoint = nextTile.getReferencePoint(throwAway.point, car.speed)
    const nextTileLocation = nextTile.travelFunction(nextTile.totalSteps, nextEntryPoint)
    if (!nextEntryPoint)
      return {
        location: currentTile.travelFunction(0, car.entryPoint),
        speed: 0,
        entryPoint: car.entryPoint
      }

    return getNextLocation({
      ...car,
      step: nextTile.totalSteps,
      entryPoint: nextEntryPoint,
      coordinates: nextTileLocation.point,
      rotation: nextTileLocation.rotation
    }, tiles, stepsBeyondTile)
  }
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
