import { TILE_WIDTH, TILE_HEIGHT} from '../../constants'
import { Tile, Train } from '../../models'

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

/**
 * utility function for persisting arbitrary changes
 * to tiles on state
 */
export function updateTileOnState(state, params) {
  const index = params.position.toString()
  const tile = state.tiles[index]

  if (tileIsOccupied(state, tile)) {
    return state
  }

  return {
    ...state,
    tiles: {
      ...state.tiles,
      [index]: new Tile({...tile, ...params})
    }
  }
}

export function tileIsOccupied(state, tile) {
  const index = tile.position.toString()
  const occupiedTiles = Object.values(state.trains).map(tr => tr.tilePosition.toString())
  return occupiedTiles.includes(index)
}

/**
 * utility function for persisting arbitrary changes
 * to trains on state
 */
export function updateTrainOnState(state, params) {
  const train = selectTrainById(state, params.id)
  return {
    ...state,
    trains: {
      ...state.trains,
      [train.id]: new Train({...train, ...params})
    }
  }
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
