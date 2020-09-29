

export const loop =  {
  trains: [
    { id: "A", coordinates: [ 260, 150 ], speed: 0, step: 0 }
  ],
  tiles: [
    { id: "1", type: "STRAIGHT", rotation: 270, position: [ 3, 0 ]},
    { id: "1a", type: "STRAIGHT", rotation: 270, position: [ 4, 0 ]},
    { id: "2", type: "CURVE",    rotation: 270, position: [ 5, 0 ]},
    { id: "3", type: "STRAIGHT", rotation:   0, position: [ 5, 1 ]},
    { id: "4", type: "CURVE",    rotation:   0, position: [ 5, 2 ]},
    { id: "4a", type: "STRAIGHT", rotation:  90, position: [ 4, 2 ]},
    { id: "5", type: "STRAIGHT", rotation:  90, position: [ 3, 2 ]},
    { id: "6", type: "CURVE",    rotation:  90, position: [ 2, 2 ]},
    { id: "7", type: "STRAIGHT", rotation: 180, position: [ 2, 1 ]},
    { id: "8", type: "CURVE",    rotation: 180, position: [ 2, 0 ]},
  ]
}

export const branching = {
  trains: [
    { id: "A", coordinates: [ 260, 150 ], speed: 0, step: 0 }
  ],
  tiles: [
    { id:  "1", type: "STRAIGHT", rotation:   90, position: [ 2, 1 ]},
    { id:  "2", type: "YLEFT",    rotation:  270, position: [ 3, 1 ]},
    { id:  "3", type: "YRIGHT",   rotation:  270, position: [ 4, 1 ]},
    { id:  "4", type: "CURVE",    rotation:   90, position: [ 1, 1 ]},
    { id:  "5", type: "CURVE",    rotation:  270, position: [ 3, 0 ]},
    { id:  "6", type: "STRAIGHT", rotation:  270, position: [ 2, 0 ]},
    { id:  "7", type: "CURVE",    rotation:  180, position: [ 1, 0 ]},
    { id:  "8", type: "CURVE",    rotation:  270, position: [ 5, 1 ]},
    { id:  "9", type: "CURVE",    rotation:    0, position: [ 5, 2 ]},
    { id: "10", type: "CURVE",    rotation:   90, position: [ 4, 2 ]},
  ]
}

export const straight = {
  trains: [
    { id: "A", coordinates: [ 210, 150 ], speed: 0, step: 0 }
  ],
  tiles: [
    { id: "1", type: "STRAIGHT", rotation:  270, position: [ 2, 1 ]},
    { id: "2", type: "CURVE",    rotation:  0, position: [ 3, 1 ]},
  ]
}

export const single = {
  trains: [
    { id: "A", coordinates: [ 260, 150 ], speed: 0, step: 0 }
  ],
  tiles: [
    { id: "1", type: "STRAIGHT", rotation:  90, position: [ 2, 1 ]},
  ]
}

export default loop
