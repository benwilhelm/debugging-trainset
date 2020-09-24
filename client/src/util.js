import { TILE_WIDTH, TILE_HEIGHT } from './constants'

export function tilePositionFromCoordinates([x, y]) {
  return [
    Math.floor(x / TILE_WIDTH),
    Math.floor(y / TILE_HEIGHT)
  ]
}

export function coordinatesInSameTile(coord1, coord2) {
  const pos1 = tilePositionFromCoordinates(coord1)
  const pos2 = tilePositionFromCoordinates(coord2)

  return pos1[0] === pos2[0] && pos1[1] === pos2[1]
}

export function reflectOver(val, reflector) {
  const diff = reflector - val
  return val + (2*diff)
}
