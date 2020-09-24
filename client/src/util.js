import { TILE_WIDTH, TILE_HEIGHT } from './constants'

export function tilePositionFromCoordinates([x, y]) {
  return [
    Math.floor(x / TILE_WIDTH),
    Math.floor(y / TILE_HEIGHT)
  ]
}

export function reflectOver(val, reflector) {
  const diff = reflector - val
  return val + (2*diff)
}
