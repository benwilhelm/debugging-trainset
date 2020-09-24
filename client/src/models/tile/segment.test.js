import segmentFactory from './segment'
import { EntryPointError } from './error-types'
import { TILE_WIDTH, TILE_HEIGHT, HALF_WIDTH, HALF_HEIGHT, QUARTER_ARC_LENGTH } from '../../constants'

describe("SegmentCurve", () => {

  describe('travelFunction', () => {

    test('should graph path along quarter arc', () => {
      const segment = segmentFactory({ type: 'CURVE', rotation: 0 })
      expect(segment.totalSteps).toEqual(QUARTER_ARC_LENGTH)
      const arcStart = segment.travelFunction(0)
      expect(arcStart[0]).toBeCloseTo(HALF_WIDTH)
      expect(arcStart[1]).toBeCloseTo(0)

      const arcMidPoint = segment.travelFunction(QUARTER_ARC_LENGTH/2)
      expect(arcMidPoint[0]).toBeCloseTo(35.355)
      expect(arcMidPoint[1]).toBeCloseTo(35.355)

      const arcEnd = segment.travelFunction(QUARTER_ARC_LENGTH)
      expect(arcEnd[0]).toBeCloseTo(0)
      expect(arcEnd[1]).toBeCloseTo(HALF_HEIGHT)
    })

    // necessary for the handoff from one tile to the next
    test.todo('should allow travel beyond extents of tile')
  })
})

describe("SegmentStraight", () => {

  describe('travelFunction', () => {

    test('should graph path along vertical line',  () => {
      const segment = segmentFactory({ type: 'STRAIGHT', rotation: 0 })
      expect(segment.totalSteps).toEqual(TILE_HEIGHT)
      for (let i = 0; i<=segment.totalSteps; i+=0.25) {
        expect(segment.travelFunction(i)).toEqual([TILE_WIDTH/2, i])
      }
    })

    // necessary for the handoff from one tile to the next
    test('should allow travel beyond extents of tile', () => {
      const segment = segmentFactory({ type: 'STRAIGHT', rotation: 0 })
      expect(segment.travelFunction(-1)).toEqual([TILE_WIDTH/2, -1])
      expect(segment.travelFunction(TILE_HEIGHT+1)).toEqual([TILE_WIDTH/2, TILE_HEIGHT+1])
    })
  })
})
