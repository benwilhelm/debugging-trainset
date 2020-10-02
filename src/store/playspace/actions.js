import { Train, Tile } from '../../models'
import { keyBy } from 'lodash'

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

export const addTrainToTile = (tile) => {
  return {
    type: INSERT_TRAIN,
    payload: new Train({
      tilePosition: tile.position,
      tileDirection: 1,
      step: tile.totalSteps / 2,
    })
  }
}

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
  payload: new Tile(tile)
})

export const deleteTile = (tile) => ({
  type: DELETE_TILE,
  payload: tile.position
})

export const loadTiles = (tileArray) => {
  const tiles = tileArray.map(tile => new Tile(tile))
  return {
    type: LOAD_TILES,
    payload: keyBy(tiles, tile => tile.position.toString())
  }
}
