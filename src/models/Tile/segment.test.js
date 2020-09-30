import segmentFactory from './segment'
import { EntryPointError } from './error-types'
import { TILE_WIDTH, TILE_HEIGHT, HALF_WIDTH, HALF_HEIGHT, QUARTER_ARC_LENGTH } from '../../constants'

describe("SegmentCurve", () => {

  describe('travelFunction', () => {

    test('should graph path along quarter arc', () => {
      const segment = segmentFactory({ type: 'CURVE', rotation: 0 })
      expect(segment.totalSteps).toEqual(QUARTER_ARC_LENGTH)
      const arcStart = segment.travelFunction(0)
      expect(arcStart.point[0]).toBeCloseTo(HALF_WIDTH)
      expect(arcStart.point[1]).toBeCloseTo(0)
      expect(arcStart.rotation).toEqual(0)

      const arcMidPoint = segment.travelFunction(QUARTER_ARC_LENGTH/2)
      expect(arcMidPoint.point[0]).toBeCloseTo(35.355)
      expect(arcMidPoint.point[1]).toBeCloseTo(35.355)
      expect(arcMidPoint.rotation).toEqual(45)

      const arcEnd = segment.travelFunction(QUARTER_ARC_LENGTH)
      expect(arcEnd.point[0]).toBeCloseTo(0)
      expect(arcEnd.point[1]).toBeCloseTo(HALF_HEIGHT)
      expect(arcEnd.rotation).toEqual(90)
    })
  })
})

describe("SegmentStraight", () => {

  describe('travelFunction', () => {

    test('should graph path along vertical line',  () => {
      const segment = segmentFactory({ type: 'STRAIGHT', rotation: 0 })
      expect(segment.totalSteps).toEqual(TILE_HEIGHT)
      for (let i = 0; i<=segment.totalSteps; i+=0.25) {
        const position = segment.travelFunction(i)
        expect(position.point).toEqual([TILE_WIDTH/2, i])
        expect(position.rotation).toEqual(0)
      }
    })

    // necessary for the handoff from one tile to the next
    test('should allow travel beyond extents of tile', () => {
      const segment = segmentFactory({ type: 'STRAIGHT', rotation: 0 })
      expect(segment.travelFunction(-1).point).toEqual([TILE_WIDTH/2, -1])
      expect(segment.travelFunction(TILE_HEIGHT+1).point).toEqual([TILE_WIDTH/2, TILE_HEIGHT+1])
    })
  })
})
