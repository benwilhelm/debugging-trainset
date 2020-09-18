export const loop =  [
  { id: "1", type: "STRAIGHT", rotation: 270, position: [ 3, 0 ]},
  { id: "2", type: "CURVE",    rotation: 270, position: [ 4, 0 ]},
  { id: "3", type: "STRAIGHT", rotation:   0, position: [ 4, 1 ]},
  { id: "4", type: "CURVE",    rotation:   0, position: [ 4, 2 ]},
  { id: "5", type: "STRAIGHT", rotation:  90, position: [ 3, 2 ]},
  { id: "6", type: "CURVE",    rotation:  90, position: [ 2, 2 ]},
  { id: "7", type: "STRAIGHT", rotation: 180, position: [ 2, 1 ]},
  { id: "8", type: "CURVE",    rotation: 180, position: [ 2, 0 ]},
]

export const straight = [
  { id: "1", type: "STRAIGHT", rotation:   0, position: [ 2, 1 ]},
  { id: "2", type: "STRAIGHT", rotation: 180, position: [ 2, 2 ]},
]

export const single = [
  { id: "1", type: "STRAIGHT", rotation: 0, position: [ 3, 0] }
]

export default loop
