import Tile from './index'
import { SegmentStraight, SegmentCurve } from './segment'
import { TILE_WIDTH, TILE_HEIGHT, HALF_WIDTH, HALF_HEIGHT, QUARTER_ARC_LENGTH } from '../../constants'

describe('Tile class', () => {
  test('STRAIGHT type should have single straight segment', () => {
    const tile = new Tile({ type: 'STRAIGHT' })
    expect(tile.segments.length).toEqual(1)
    const segment = tile.segments[0]
    expect(segment).toBeInstanceOf(SegmentStraight)
  })

  test('CURVE type should have single curve segment', () => {
    const tile = new Tile({ type: 'CURVE' })
    expect(tile.segments.length).toEqual(1)
    const segment = tile.segments[0]
    expect(segment).toBeInstanceOf(SegmentCurve)
  })

  test('YLEFT type should have straight segment and curve rotated 90', () => {
    const tile = new Tile({ type: 'YLEFT' })
    expect(tile.segments.length).toEqual(2)
    const [ straight, curve ] = tile.segments
    expect(straight).toBeInstanceOf(SegmentStraight)
    expect(curve).toBeInstanceOf(SegmentCurve)
    expect(curve.rotation).toEqual(90)
  })

  test('YRIGHT type should have straight segment and curve not rotated', () => {
    const tile = new Tile({ type: 'YRIGHT' })
    expect(tile.segments.length).toEqual(2)
    const [ straight, curve ] = tile.segments
    expect(straight).toBeInstanceOf(SegmentStraight)
    expect(curve).toBeInstanceOf(SegmentCurve)
    expect(curve.rotation).toEqual(0)
  })

  describe('nextTilePosition()', () => {
    test('should give position of next tile', () => {
      const tile = new Tile({ type: 'STRAIGHT', position: [0, 0]})
      expect(tile.nextTilePosition('negY')).toEqual([0, 1])
      expect(tile.nextTilePosition('posY')).toEqual([0, -1])
    })

    test('should account for rotation, etc', () => {
      const tile = new Tile({ type: 'YLEFT', rotation: 180, selectedSegment: 1, position: [2,2]})
      expect(tile.nextTilePosition('negY')).toEqual([ 2, 3 ])
      expect(tile.nextTilePosition('negX')).toEqual([ 1, 2 ])
    })
  })


  describe('previousTilePosition()', () => {
    test('should give position of next tile', () => {
      const tile = new Tile({ type: 'STRAIGHT', position: [0, 0]})
      expect(tile.previousTilePosition('posY')).toEqual([0, 1])
      expect(tile.previousTilePosition('negY')).toEqual([0, -1])
    })

    test('should account for rotation, etc', () => {
      const tile = new Tile({ type: 'YLEFT', rotation: 180, selectedSegment: 1, position: [2,2]})
      expect(tile.previousTilePosition('negX')).toEqual([ 2, 3 ])
      expect(tile.previousTilePosition('negY')).toEqual([ 1, 2 ])
    })
  })

  
  describe('closestEntryPoint()', () => {
    test('basic case with no rotation', () => {
      const tile = new Tile({ type: 'STRAIGHT', position: [0, 0]})
      expect(tile.closestEntryPoint([ 0,  50])).toEqual('negX')
      expect(tile.closestEntryPoint([50,   0])).toEqual('negY')
      expect(tile.closestEntryPoint([50, 100])).toEqual('posY')
      expect(tile.closestEntryPoint([100, 50])).toEqual('posX')
    })

    test('rotated tile', () => {
      const tile = new Tile({ type: 'STRAIGHT', position: [0, 0], rotation: 90})
      expect(tile.closestEntryPoint([ 0,  50])).toEqual('posY')
      expect(tile.closestEntryPoint([50,   0])).toEqual('negX')
      expect(tile.closestEntryPoint([50, 100])).toEqual('posX')
      expect(tile.closestEntryPoint([100, 50])).toEqual('negY')
    })

    test('rotated segment', () => {
      const tile = new Tile({ type: 'YLEFT', position: [0, 0], selectedSegment: 1})
      expect(tile.closestEntryPoint([ 0,  50])).toEqual('posY')
      expect(tile.closestEntryPoint([50,   0])).toEqual('negX')
      expect(tile.closestEntryPoint([50, 100])).toEqual('posX')
      expect(tile.closestEntryPoint([100, 50])).toEqual('negY')
    })

    test('rotated tile and segment', () => {
      const tile = new Tile({ type: 'YLEFT', position: [0, 0], rotation: 90, selectedSegment: 1})
      expect(tile.closestEntryPoint([ 0,  50])).toEqual('posX')
      expect(tile.closestEntryPoint([50,   0])).toEqual('posY')
      expect(tile.closestEntryPoint([50, 100])).toEqual('negY')
      expect(tile.closestEntryPoint([100, 50])).toEqual('negX')
    })
  })

  describe('totalSteps property', () => {
    test('should return totalSteps of selected segment', () => {
      const tile = new Tile({ type: 'YLEFT', position: [1, 2] })
      tile.selectedSegment = 0
      expect(tile.totalSteps).toEqual(TILE_HEIGHT)
      tile.selectedSegment = 1
      expect(tile.totalSteps).toEqual(QUARTER_ARC_LENGTH)
    })
  })

  describe('getReferencePoint()', () => {
    test('should return `from` when entering `from` forwards', () => {
      const tile = new Tile({ type: 'STRAIGHT', position: [0,0] })
      const referencePoint = tile.getReferencePoint([HALF_WIDTH, 0], 1)
      expect(referencePoint).toEqual('negY')
    })

    test('should return `to` when entering `from` backwards', () => {
      const tile = new Tile({ type: 'STRAIGHT', position: [0, 0]})
      const referencePoint = tile.getReferencePoint([HALF_WIDTH, 0], -1)
      expect(referencePoint).toEqual('posY')
    })

    test('should return `to` when entering `to` forwards', () => {
      const tile = new Tile({ type: 'STRAIGHT', position: [0,0] })
      const referencePoint = tile.getReferencePoint([HALF_WIDTH, TILE_HEIGHT], 1)
      expect(referencePoint).toEqual('posY')
    })

    test('should return `from` when entering `to` backwards', () => {
      const tile = new Tile({ type: 'STRAIGHT', position: [0,0] })
      const referencePoint = tile.getReferencePoint([HALF_WIDTH, TILE_HEIGHT], -1)
      expect(referencePoint).toEqual('negY')
    })

    test('should return null for other entry points', () => {
      const tile = new Tile({ type: 'STRAIGHT', position: [0,0] })
      const referencePoint = tile.getReferencePoint([TILE_WIDTH, HALF_HEIGHT], -1)
      expect(referencePoint).toBeNull()
    })
  })

  describe('travelFunction()', () => {
    test('applies the position and rotation to selected segment\'s travel function', () => {
      const tile = new Tile({ type: 'STRAIGHT', position: [1, 2], rotation: 90})
      const start = tile.travelFunction(0, 'negY')
      expect(start.point).toEqual([200, 250])
      expect(start.rotation).toEqual(90)

      const end = tile.travelFunction(TILE_HEIGHT, 'negY')
      expect(end.point).toEqual([100, 250])
      expect(end.rotation).toEqual(90)
    })

    test('reflects step over midpoint and rotates engine when traveling upstream', () => {
      const tile = new Tile({ type: 'STRAIGHT', position: [0, 0], rotation: 90})
      const start = tile.travelFunction(0, 'posY')
      expect(start.point).toEqual([0, 50])
      expect(start.rotation).toEqual(270)

      const end = tile.travelFunction(TILE_HEIGHT, 'posY')
      expect(end.point).toEqual([100, 50])
      expect(end.rotation).toEqual(270)
    })

    test('accounts for rotated segments', () => {
      const tile = new Tile({ type: 'YLEFT', position: [1, 2], rotation: 90, selectedSegment: 1})
      const next = tile.travelFunction(0, 'negY')
      expect(next.point).toEqual([150, 300])
      expect(next.rotation).toEqual(180)
    })
  })
})
