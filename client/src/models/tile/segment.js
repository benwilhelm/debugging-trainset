import { TILE_HEIGHT, TILE_WIDTH} from '../../constants'

const segmentFactory = (segment) => {
  switch (segment.type) {
    case "STRAIGHT":
      return new SegmentStraight(segment)

    case "CURVE":
      return new SegmentCurve(segment)

    default:
      throw new Error("malformed segment or unknown type")
  }
}
export default segmentFactory


class Segment {
  constructor(params) {
    this.rotation = params.rotation
  }
}

export class SegmentStraight extends Segment {

  type = 'STRAIGHT'
  totalSteps = TILE_HEIGHT
  from = 'negY'
  to = 'posY'

  travelFunction(step) {
    return [ TILE_WIDTH/2, step ]
  }
}

export class SegmentCurve extends Segment {

  type = 'CURVE'
  totalSteps = (Math.PI * TILE_WIDTH) / 4
  from = "negY"
  to = "negX"

  travelFunction(step) {
    const radPerStep = (Math.PI / 2) / this.totalSteps
    const theta = step * radPerStep
    const r = TILE_WIDTH / 2
    return [
      r * Math.cos(theta),
      r * Math.sin(theta)
    ]
  }
}
