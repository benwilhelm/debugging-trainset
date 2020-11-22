/**
 * This is the reducer for all actions within the playspace.
 *
 * Action creators can be found in ./actions
 * Selector functions and other utilities can be found in ./selectors.js
 * Asynchronous behavior is found in ./thunks.js
 */

import {
  updateTileOnState,
  updateTrainOnState,
  getDestinationTile,
  selectTrainById,
  tileIsOccupied,
} from './selectors'

export const initialState = {
  trains: {},
  tiles: {}
}

const actionHandlers = {
  INSERT_TRAIN: (state, { payload: train }) => {
    return {
      ...state,
      trains: {
        ...state.trains,
        [train.id]: train
      }
    }
  },

  UPDATE_TRAIN: (state, {payload}) => updateTrainOnState(state, payload),

  STOP_TRAIN: (state, { payload: trainId }) => {
    return updateTrainOnState(state, { id: trainId, speed: 0})
  },

  TRAIN_TRAVEL: (state, {payload}) => {
    const {train, steps} = payload
    const params = getDestinationTile(train, steps, state.tiles)
    return updateTrainOnState(state, {...train, ...params})
  },

  ADD_CAR_TO_TRAIN: (state, { payload: trainId }) => {
    const train = selectTrainById(state, trainId)
    const cars = train.cars + 1
    return updateTrainOnState(state, { ...train, cars })
  },

  REMOVE_CAR_FROM_TRAIN: (state, { payload: trainId }) => {
    const train = selectTrainById(state, trainId)
    const cars = (train.cars <= 0) ? 0 : train.cars - 1
    return updateTrainOnState(state, { ...train, cars })
  },

  DELETE_TRAIN: (state, { payload: trainId }) => {
    const trains = {...state.trains}
    delete trains[trainId]
    return {...state, trains}
  },

  UPDATE_TILE: (state, { payload }) => {
    return updateTileOnState(state, payload)
  },

  ROTATE_TILE: (state, { payload: position }) => {
    const tile = state.tiles[position.toString()]
    const rotation = (tile.rotation + 90) % 360
    return updateTileOnState(state, {...tile, rotation})
  },

  TOGGLE_SEGMENT: (state, { payload: position }) => {
    const tile = state.tiles[position.toString()]
    const selectedSegment = tile.selectedSegment < tile.segments.length - 1
                          ? tile.selectedSegment + 1
                          : 0
    return updateTileOnState(state, {...tile, selectedSegment})
  },

  INSERT_TILE: (state, { payload }) => {
    const index = payload.position.toString()
    return {
      ...state,
      tiles: {
        ...state.tiles,
        [index]: payload
      }
    }
  },

  DELETE_TILE: (state, { payload: position }) => {
    const index = position.toString()
    const tiles = {...state.tiles}

    if (tileIsOccupied(state, tiles[index]))
      return state

    delete tiles[index]
    return { ...state, tiles }
  },

  LOAD_TILES: (state, { payload }) => {
    return { ...state, tiles: payload }
  }

}

export default function reducer(state=initialState, action) {
  return actionHandlers.hasOwnProperty(action.type)
       ? actionHandlers[action.type](state, action)
       : state
}
