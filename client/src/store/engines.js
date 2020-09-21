export const UPDATE_ENGINE = "UPDATE_ENGINE"

const initialState = {
  byId: new Map([
    ["A", { id: "A", coordinates: [ 240, 210 ], speed: 0 }]
  ])
}


export const updateEngine = (id, props) => ({
  type: UPDATE_ENGINE,
  payload: { ...props, id }
})

const actionHandlers = {
  [UPDATE_ENGINE]: (state, {payload}) => {
    const existingEngine = selectEngineById(state, payload.id)
    const updatedEngine = { ...existingEngine, ...payload }
    const byId = new Map(state.byId)
    byId.set(payload.id, updatedEngine)
    return { ...state, byId }
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
