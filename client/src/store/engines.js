import { TILE_WIDTH, TILE_HEIGHT } from '../constants'
export const UPDATE_ENGINE = "UPDATE_ENGINE"
export const ENGINE_TRAVEL = "ENGINE_TRAVEL"

const initialState = {
  byId: new Map([
    ["A", { id: "A", coordinates: [ 240, 210 ], speed: 0 }]
  ])
}


export const updateEngine = (id, props) => ({
  type: UPDATE_ENGINE,
  payload: { ...props, id }
})

export const engineTravel = (engine, tile, deltaTime) => ({
  type: ENGINE_TRAVEL,
  payload: { engine, tile, deltaTime}
})

const actionHandlers = {
  [UPDATE_ENGINE]: (state, {payload}) => {
    const existingEngine = selectEngineById(state, payload.id)
    const updatedEngine = { ...existingEngine, ...payload }
    const byId = new Map(state.byId)
    byId.set(payload.id, updatedEngine)
    return { ...state, byId }
  },
  [ENGINE_TRAVEL]: (state, {payload}) => {
    const {engine, tile, deltaTime} = payload
    const newTile = (engine.tileId !== tile.id)
    if (newTile) {
      const entryPoint = getEntryPoint(tile, engine.coordinates)
      return actionHandlers[UPDATE_ENGINE](state, { payload: {
        id: engine.id,
        tileId: tile.id,
        step: 0,
        entryPoint
      }})
    } else {
      const travelFunction = tile.travelFunctions[engine.entryPoint]
      const step = engine.step + (deltaTime/1000) * engine.speed
      const coordinates = travelFunction(step, engine.coordinates)

      return actionHandlers[UPDATE_ENGINE](state, { payload: {
        id: engine.id,
        tileId: tile.id,
        step,
        coordinates
      }})
    }
  }
}

const reducer = (state=initialState, action) => {
  return actionHandlers.hasOwnProperty(action.type)
       ? actionHandlers[action.type](state, action)
       : state
}


export function selectEngineById(state, id) {
  return state.byId.get(id)
}

export function selectAllEngines(state) {
  return Array.from(state.byId.values())
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

  let adjustedIndex = closestBorderIndex - (tile.rotation / 90)
  if (adjustedIndex < 0) {
    adjustedIndex += 4
  }
  return borders[adjustedIndex]
}
