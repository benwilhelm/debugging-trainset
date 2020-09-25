import { TILE_WIDTH, TILE_HEIGHT } from '../../constants'
import { v4 as uuid } from 'uuid'
import segmentFactory from './segment'
import { reflectOver } from '../../util'

export default class Tile {
  constructor({ id, type, position, rotation=0, selectedSegment=0}) {
    this.type = type
    this.position = position
    this.id = id || uuid()
    this.rotation = rotation
    this.segments = getTileSegments(type)
    this.selectedSegment = selectedSegment
  }

  get totalSteps()  {
    const segment = this.segments[this.selectedSegment]
    return segment.totalSteps
  }

  get from() {
    const segment = this.segments[this.selectedSegment]
    return segment.from
  }

  get to() {
    const segment = this.segments[this.selectedSegment]
    return segment.to
  }

  closestEntryPoint(coordinates) {
    const tileMidpoint = [
      (this.position[0] * TILE_WIDTH) + (TILE_WIDTH/2),
      (this.position[1] * TILE_HEIGHT) + (TILE_HEIGHT/2),
    ]

    const rise = coordinates[1] - tileMidpoint[1]
    const run  = coordinates[0] - tileMidpoint[0]
    const orientation = Math.abs(rise) > Math.abs(run) ? "Y" : "X"

    const borders = ["negY", "posX", "posY", "negX"]
    const closestBorderIndex = (orientation === "X" && run > 0) ? 1
                        : (orientation === "X" && run <= 0) ? 3
                        : (orientation === "Y" && rise < 0) ? 0
                        : 2

    const segment = this.segments[this.selectedSegment]
    const totalRotation = (this.rotation + segment.rotation) % 360
    let adjustedIndex = closestBorderIndex - (totalRotation / 90)
    if (adjustedIndex < 0) {
      adjustedIndex += 4
    }
    return borders[adjustedIndex]
  }

  travelFunction(step, entryPoint) {
    const validEntry = this.validEntryPoint(entryPoint)
    if (!validEntry)
      throw new Error("Invalid Entry Point")

    const segment = this.segments[this.selectedSegment]
    // going through it 'backwards'
    if (validEntry === -1)
      step = reflectOver(step, (segment.totalSteps / 2))

    const {rotation: engineRotation, point: [x, y]} = segment.travelFunction(step)
    const totalRotation = (this.rotation + segment.rotation) % 360
    const [ax, ay] = [TILE_WIDTH/2, TILE_HEIGHT/2]
    const rotated = (totalRotation ===  90) ? [ -(y-ay) + ax,  (x-ax) + ay ]
                  : (totalRotation === 180) ? [ -(x-ax) + ax, -(y-ay) + ay ]
                  : (totalRotation === 270) ? [  (y-ay) + ax, -(x-ax) + ay ]
                  : [x, y]
    return {
      rotation: totalRotation + engineRotation + (validEntry === -1 ? 180 : 0),
      point: [
        rotated[0] + this.position[0] * TILE_WIDTH,
        rotated[1] + this.position[1] * TILE_HEIGHT
      ]
    }
  }

  validEntryPoint(entryPoint) {
    const segment = this.segments[this.selectedSegment]
    return (entryPoint === segment.from) ?  1
         : (entryPoint === segment.to)   ? -1
         : 0
  }

  getReferencePoint(coordinates, speed) {
    const forward = (speed >= 0)
    const trueEntryPoint = this.closestEntryPoint(coordinates)
    const segment = this.segments[this.selectedSegment]

    if (trueEntryPoint === segment.from) {
      return (forward) ? segment.from : segment.to
    }

    if (trueEntryPoint === segment.to) {
      return (forward) ? segment.to : segment.from
    }

    return null
  }
}


function getTileSegments(type) {
  switch (type) {
    case "STRAIGHT":
      return [ segmentFactory({ type: "STRAIGHT", rotation: 0 }) ]
    case "CURVE":
      return [ segmentFactory({ type: "CURVE", rotation: 0 }) ]
    case "YLEFT":
      return [
        segmentFactory({ type: "STRAIGHT", rotation: 0 }),
        segmentFactory({ type: "CURVE", rotation: 90 })
      ]
    case "YRIGHT":
      return [
        segmentFactory({ type: "STRAIGHT", rotation: 0 }),
        segmentFactory({ type: "CURVE", rotation: 0 })
      ]
    default:
      throw new Error(`Unknown segment type: ${type}`)
  }
}
