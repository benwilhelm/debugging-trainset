import { TILE_WIDTH, TILE_HEIGHT } from '../constants'
import { branching as tiles } from '../data/trackset'
import { coordinatesInSameTile } from '../util'

export const UPDATE_ENGINE = "UPDATE_ENGINE"
export const ENGINE_TRAVEL = "ENGINE_TRAVEL"
export const UPDATE_TILE = "UPDATE_TILE"
export const INSERT_TILE = "INSERT_TILE"
export const TOGGLE_SEGMENT = "TOGGLE_SEGMENT"

const initialState = {
  engines: new Map([
    ["A", { id: "A", coordinates: [ 210, 140 ], speed: 0, step: 0 }]
  ]),

  tiles: tiles.reduce((map, tile) => {
    const index = indexFromPosition(tile.position)
    map.set(index, tileFactory(tile))
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
    const entryPoint = engine.entryPoint || getEntryPoint(tile, engine.coordinates)
    const travelFunction = tile.travelFunctions[entryPoint]
    const step = engine.step + (deltaTime/1000) * engine.speed
    const nextCoordinates = travelFunction(step)
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
        entryPoint,
        step,
      }})
    }

    const nextEntryPoint = getEntryPoint(nextTile, nextCoordinates)
    const nextTravelFunction = nextTile.travelFunctions[nextEntryPoint]
    if (nextTravelFunction) {
      return actionHandlers[UPDATE_ENGINE](state, { payload: {
        id: engine.id,
        coordinates: nextCoordinates,
        entryPoint: nextEntryPoint,
        step: 0
      }})
    }

    return actionHandlers[UPDATE_ENGINE](state, { payload: {
      id: engine.id,
      speed: 0
    }})
  },

  [UPDATE_TILE]: (state, { payload }) => {
    const existingTile = selectTileByPosition(state, payload.position)
    const updatedTile = tileFactory({...existingTile, ...payload })
    const index = indexFromPosition(updatedTile.position)
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
  const index = indexFromPosition(position)
  return state.tiles.get(index)
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



function getEntryPoint(tile, coordinates) {
  const tileMidpoint = [
    (tile.position[0] * TILE_WIDTH) + (TILE_WIDTH/2),
    (tile.position[1] * TILE_HEIGHT) + (TILE_HEIGHT/2),
  ]

  const rise = coordinates[1] - tileMidpoint[1]
  const run  = coordinates[0] - tileMidpoint[0]
  const orientation = Math.abs(rise) > Math.abs(run) ? "Y" : "X"

  const borders = ["negY", "posX", "posY", "negX"]
  const closestBorderIndex = (orientation === "X" && run > 0) ? 1
                      : (orientation === "X" && run <= 0) ? 3
                      : (orientation === "Y" && rise < 0) ? 0
                      : 2

  const segment = tile.segments[tile.selectedSegment]
  const totalRotation = (tile.rotation + segment.rotation) % 360
  let adjustedIndex = closestBorderIndex - (totalRotation / 90)
  if (adjustedIndex < 0) {
    adjustedIndex += 4
  }
  return borders[adjustedIndex]
}


function tileFactory(tile) {
  tile.segments = getTileSegments(tile)
  tile.selectedSegment = tile.selectedSegment || 0
  tile.travelFunctions = generateTravelFunctions(tile)
  tile.id = indexFromPosition(tile.position)
  return { ...tile }
}

function getTileSegments(tile) {
  return (tile.type === "STRAIGHT")
       ? [{ type: "STRAIGHT", rotation: 0 }]

       : (tile.type === "CURVE")
       ? [{ type: "CURVE", rotation: 0 }]

       : (tile.type === "YLEFT")
       ? [
           { type: "STRAIGHT", rotation: 0 },
           { type: "CURVE", rotation: 90 }
         ]

       : (tile.type === "YRIGHT")
       ? [
           { type: "STRAIGHT", rotation: 0 },
           { type: "CURVE", rotation: 0 }
         ]

       : []
  }


// UTILITY
//==========

export function indexFromPosition([x, y]){
  return `${+x}, ${+y}`
}

const travelTransform = (tile, [x, y]) => {
  const segment = tile.segments[tile.selectedSegment]
  const totalRotation = (tile.rotation + segment.rotation) % 360
  const [ax, ay] = [TILE_WIDTH/2, TILE_HEIGHT/2]
  const rotated = (totalRotation ===  90) ? [ -(y-ay) + ax,  (x-ax) + ay ]
                : (totalRotation === 180) ? [ -(x-ax) + ax, -(y-ay) + ay ]
                : (totalRotation === 270) ? [  (y-ay) + ax, -(x-ax) + ay ]
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
  const selectedSegment = tile.segments[tile.selectedSegment]
  switch (selectedSegment.type) {
    case "STRAIGHT":
      return ({
        'posY': (step) => travelTransform(tile, [TILE_WIDTH / 2, reflectOver(step, TILE_HEIGHT / 2)]),
        'negY': (step) => travelTransform(tile, [TILE_WIDTH / 2, step]),
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
        'negY': (step) => {
          return pointFromStep(step)
        },
        'negX': (step) => {
          step = reflectOver(step, totalSteps/2)
          return pointFromStep(step)
        }
      })
  }
}
