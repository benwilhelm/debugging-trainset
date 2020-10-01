import { TILE_WIDTH, TILE_HEIGHT } from '../constants'
import Tile from '../models/Tile'
import Train from '../models/Train'
import { saveTileData, loadTileData } from '../services/persistence'

export const UPDATE_TRAIN = "UPDATE_TRAIN"
export const STOP_TRAIN = "STOP_TRAIN"
export const TRAIN_TRAVEL = "TRAIN_TRAVEL"
export const INSERT_TRAIN = "INSERT_TRAIN"
export const DELETE_TRAIN = "DELETE_TRAIN"
export const ADD_CAR_TO_TRAIN = "ADD_CAR_TO_TRAIN"
export const REMOVE_CAR_FROM_TRAIN = "REMOVE_CAR_FROM_TRAIN"

export const UPDATE_TILE = "UPDATE_TILE"
export const ROTATE_TILE = "ROTATE_TILE"
export const INSERT_TILE = "INSERT_TILE"
export const DELETE_TILE = "DELETE_TILE"
export const LOAD_TILES = "LOAD_TILES"
export const TOGGLE_SEGMENT = "TOGGLE_SEGMENT"



const initialState = {
  trains: {},
  tiles: {}
}

// ACTION CREATORS
// ====================

export const updateTrain = (train) => ({
  type: UPDATE_TRAIN,
  payload: train
})

export const trainTravel = (train, steps) => ({
  type: TRAIN_TRAVEL,
  payload: { train, steps }
})

export const stopTrain = (train) => ({
  type: STOP_TRAIN,
  payload: train.id
})

export const addCarToTrain = (train) => ({
  type: ADD_CAR_TO_TRAIN,
  payload: train.id
})

export const removeCarFromTrain = (train) => ({
  type: REMOVE_CAR_FROM_TRAIN,
  payload: train.id
})

export const deleteTrain = (train) => ({
  type: DELETE_TRAIN,
  payload: train.id
})

export const addTrainToTile = (tile) => {
  return {
    type: INSERT_TRAIN,
    payload: {
      tilePosition: tile.position,
      tileDirection: tile.from,
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
  type: ROTATE_TILE,
  payload: tile.position
})

export const toggleTileSegment = (tile) => ({
  type: TOGGLE_SEGMENT,
  payload: tile.position
})

export const insertTile = (tile) => ({
  type: INSERT_TILE,
  payload: tile
})

export const deleteTile = (tile) => ({
  type: DELETE_TILE,
  payload: tile.position
})

export const loadTiles = (tiles) => ({
  type: LOAD_TILES,
  payload: tiles
})


const actionHandlers = {
  [INSERT_TRAIN]: (state, { payload }) => {
    const train = new Train(payload)
    const trains = { ...state.trains }
    trains[train.id] = train
    return { ...state, trains }
  },

  [UPDATE_TRAIN]: (state, {payload}) => updateTrainOnState(state, payload),

  [STOP_TRAIN]: (state, { payload: trainId }) => {
    return updateTrainOnState(state, { id: trainId, speed: 0})
  },

  [TRAIN_TRAVEL]: (state, {payload}) => {
    const {train, steps} = payload
    const params = getDestinationTile(train, steps, state.tiles)
    return updateTrainOnState(state, {...train, ...params})
  },

  [ADD_CAR_TO_TRAIN]: (state, { payload: trainId }) => {
    const train = selectTrainById(state, trainId)
    const cars = train.cars + 1
    return updateTrainOnState(state, { ...train, cars })
  },

  [REMOVE_CAR_FROM_TRAIN]: (state, { payload: trainId }) => {
    const train = selectTrainById(state, trainId)
    const cars = (train.cars <= 0) ? 0 : train.cars - 1
    return updateTrainOnState(state, { ...train, cars })
  },

  [DELETE_TRAIN]: (state, { payload: trainId }) => {
    const trains = {...state.trains}
    delete trains[trainId]
    return {...state, trains}
  },

  [UPDATE_TILE]: (state, { payload }) => {
    return updateTileOnState(state, payload)
  },

  [ROTATE_TILE]: (state, { payload: position }) => {
    const tile = state.tiles[position.toString()]
    const rotation = (tile.rotation + 90) % 360
    return updateTileOnState(state, {...tile, rotation})
  },

  [TOGGLE_SEGMENT]: (state, { payload: position }) => {
    const tile = state.tiles[position.toString()]
    const selectedSegment = tile.selectedSegment < tile.segments.length - 1
                          ? tile.selectedSegment + 1
                          : 0
    return updateTileOnState(state, {...tile, selectedSegment})
  },

  [INSERT_TILE]: (state, { payload }) => {
    const tile = new Tile(payload)
    const index = tile.position.toString()
    const tiles = { ...state.tiles, [index]: tile }
    return {...state, tiles }
  },

  [DELETE_TILE]: (state, { payload: position }) => {
    const index = position.toString()
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

/**
 * utility function for persisting arbitrary changes
 * to tiles on state
 */
function updateTileOnState(state, params) {
  const index = params.position.toString()
  const tile = state.tiles[index]
  return {
    ...state,
    tiles: {
      ...state.tiles,
      [index]: new Tile({...tile, ...params})
    }
  }
}

/**
 * utility function for persisting arbitrary changes
 * to trains on state
 */
function updateTrainOnState(state, params) {
  const train = selectTrainById(state, params.id)
  return {
    ...state,
    trains: {
      ...state.trains,
      [train.id]: new Train({...train, ...params})
    }
  }
}


// SELECTORS
// ===================

export function selectTrainById(state, id) {
  return state.trains[id]
}

export function selectAllTrains(state) {
  return Object.values(state.trains)
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


export function getDestinationTile(train, steps, tiles) {
  const { step, tileDirection, tilePosition, speed } = train
  const tile = tiles[tilePosition.toString()]
  const destStep = step + steps

  if (destStep >=0 && destStep < tile.totalSteps) {
    return { step: destStep, tileDirection, tilePosition, speed}
  }


  const forward = (destStep >= 0)
  const nextTilePosition = (forward)
                         ? tile.nextTilePosition(tileDirection)
                         : tile.previousTilePosition(tileDirection)
  const nextTile = tiles[nextTilePosition.toString()]
  if (!nextTile) {
    return {
      step: (forward) ? tile.totalSteps : 0,
      speed: 0,
      tileDirection,
      tilePosition,
    }
  }

  const borderStep = (forward) ? tile.totalSteps + 1 : -1
  const { point: borderCoords } = tile.travelFunction(borderStep, tileDirection)
  const trainDirection = steps >= 0 ? 1 : -1
  const nextTileDirection = nextTile.getTravelDirectionFromEntryPoint(borderCoords, trainDirection)
  if (!nextTileDirection) {
    return {
      step: (forward) ? tile.totalSteps : 0,
      speed: 0,
      tileDirection,
      tilePosition,
    }
  }


  const trainParams = {
    step: 0,
    tileDirection: nextTileDirection,
    tilePosition: nextTilePosition,
    speed
  }
  const newDestStep = (forward)
                    ? destStep - tile.totalSteps
                    : nextTile.totalSteps + destStep // destStep is negative here
  return getDestinationTile(trainParams, newDestStep, tiles)
}
