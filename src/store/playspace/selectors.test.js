import { Tile, Train } from '../../models'
import { QUARTER_ARC_LENGTH } from '../../constants'
import { getDestinationTile } from './selectors'

describe('playspace selectors', () => {
  describe('getDestinationTile()', () => {

    let train
    let tiles

    beforeEach(() => {
      train = new Train({
        tilePosition: [0, 0],
        step: 50,
        tileDirection: 1,
        speed: 10
      })
      tiles = {
        '0,-2': new Tile({ type: 'CURVE',    position: [0, -2], rotation: 270 }),
        '0,-1': new Tile({ type: 'STRAIGHT', position: [0, -1], rotation:   0 }),
        '0,0' : new Tile({ type: 'STRAIGHT', position: [0,  0], rotation:   0 }),
        '0,1' : new Tile({ type: 'STRAIGHT', position: [0,  1], rotation:   0 }),
        '0,2' : new Tile({ type: 'CURVE',    position: [0,  2], rotation:  90 }),
      }
    })

    describe('same tile', () => {
      test('should move forward specified steps', () => {
        const dest = getDestinationTile(train, 25, tiles)
        expect(dest).toEqual(
          expect.objectContaining({ tilePosition: [0,0], step: 75, tileDirection: 1})
        )
        expect(dest.speed).not.toEqual(0)
      })

      test('should move backwards if steps are negative', () => {
        const dest = getDestinationTile(train, -25, tiles)
        expect(dest).toEqual(
          expect.objectContaining({ tilePosition: [0,0], step: 25, tileDirection: 1})
        )
        expect(dest.speed).not.toEqual(0)
      })

      test('should NOT invert coordinates if entered through `to` side', () => {
        train.tileDirection = -1
        const destForward = getDestinationTile(train, 25, tiles)
        expect(destForward).toEqual(
          expect.objectContaining({ tilePosition: [0,0], step: 75, tileDirection: -1})
        )
        expect(destForward.speed).not.toEqual(0)

        const destBackward = getDestinationTile(train, -25, tiles)
        expect(destBackward).toEqual(
          expect.objectContaining({ tilePosition: [0,0], step: 25, tileDirection: -1})
        )
        expect(destBackward.speed).not.toEqual(0)
      })
    })

    describe('next tile', () => {
      test('train facing forward, traveling forward', () => {
        const dest = getDestinationTile(train, 65, tiles)
        expect(dest).toEqual(
          expect.objectContaining({ tilePosition: [0,1], step: 15, tileDirection: 1})
        )
        expect(dest.speed).not.toEqual(0)
      })

      test('train facing forward, traveling backward', () => {
        const dest = getDestinationTile(train, -65, tiles)
        expect(dest).toEqual(
          expect.objectContaining({ tilePosition: [0,-1], step: 85, tileDirection: 1})
        )
        expect(dest.speed).not.toEqual(0)
      })

      test('train facing forward, traveling backward, crossing into rotated tile', () => {
        tiles['0,-1'].rotation = 180
        const dest = getDestinationTile(train, -65, tiles)
        expect(dest).toEqual(
          expect.objectContaining({ tilePosition: [0,-1], step: 85, tileDirection: -1})
        )
        expect(dest.speed).not.toEqual(0)
      })


      test('train facing backward, traveling forward', () => {
        train.tileDirection = -1
        const dest = getDestinationTile(train, 65, tiles)
        expect(dest).toEqual(
          expect.objectContaining({ tilePosition: [0,-1], step: 15, tileDirection: -1})
        )
        expect(dest.speed).not.toEqual(0)
      })

      test('train facing backward, traveling backward', () => {
        train.tileDirection = -1
        const dest = getDestinationTile(train, -65, tiles)
        expect(dest).toEqual(
          expect.objectContaining({ tilePosition: [0,1], step: 85, tileDirection: -1})
        )
        expect(dest.speed).not.toEqual(0)
      })

      test('train facing backward, traveling backward, rotated tile', () => {
        train.tileDirection = -1
        tiles['0,1'].rotation = 180
        const dest = getDestinationTile(train, -65, tiles)
        expect(dest).toEqual(
          expect.objectContaining({ tilePosition: [0,1], step: 85, tileDirection: 1})
        )
        expect(dest.speed).not.toEqual(0)
      })

    })

    describe('two tile jump', () => {
      test('train facing forward, traveling forward', () => {
        const dest = getDestinationTile(train, 165, tiles)
        expect(dest).toEqual(
          expect.objectContaining({ tilePosition: [0,2], step: 15, tileDirection: -1})
        )
        expect(dest.speed).not.toEqual(0)
      })

      test('train facing forward, traveling backward', () => {
        const dest = getDestinationTile(train, -165, tiles)
        expect(dest).toEqual(
          expect.objectContaining({ tilePosition: [0,-2], step: QUARTER_ARC_LENGTH-15, tileDirection: 1})
        )
        expect(dest.speed).not.toEqual(0)
      })

      test('train facing backward, traveling forward', () => {
        train.tileDirection = -1
        const dest = getDestinationTile(train, 165, tiles)
        expect(dest).toEqual(
          expect.objectContaining({ tilePosition: [0,-2], step: 15, tileDirection: -1})
        )
        expect(dest.speed).not.toEqual(0)
      })

      test('train facing backward, traveling backward', () => {
        train.tileDirection = -1
        const dest = getDestinationTile(train, -165, tiles)
        expect(dest).toEqual(
          expect.objectContaining({ tilePosition: [0,2], step: QUARTER_ARC_LENGTH-15, tileDirection: 1})
        )
        expect(dest.speed).not.toEqual(0)
      })

    })

    describe('hits impassable point: next tile', () => {
      test('should stop prior to crossing into invalid tile', () => {
        tiles['0,1'].rotation = 90
        const destForward = getDestinationTile(train, 165, tiles)
        expect(destForward).toEqual({ tilePosition: [0,0], step: 100, tileDirection: 1, speed: 0})

        tiles['0,-1'].rotation = 90
        const destBackward = getDestinationTile(train, -165, tiles)
        expect(destBackward).toEqual({ tilePosition: [0,0], step: 0, tileDirection: 1, speed: 0})
      })
    })


    describe('hits impassable point: multiple tiles down', () => {
      test('should stop prior to crossing into invalid tile', () => {
        tiles['0,2'].rotation = 180
        const destForward = getDestinationTile(train, 165, tiles)
        expect(destForward).toEqual({ tilePosition: [0,1], step: 100, tileDirection: 1, speed: 0})

        tiles['0,-2'].rotation = 0
        const destBackward = getDestinationTile(train, -165, tiles)
        expect(destBackward).toEqual({ tilePosition: [0,-1], step: 0, tileDirection: 1, speed: 0})
      })
    })
  })
})
