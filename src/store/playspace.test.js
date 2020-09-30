import Tile from '../models/Tile'
import Train from '../models/Train'
import { QUARTER_ARC_LENGTH } from '../constants'
import { getDestinationTile } from './playspace'

describe('playspace reducer', () => {
  describe('getDestinationTile()', () => {

    let train
    let tiles

    beforeEach(() => {
      train = new Train({
        tilePosition: [0, 0],
        step: 50,
        entryPoint: 'negY',
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
        expect(dest).toEqual({ tilePosition: [0,0], step: 75, entryPoint: 'negY', speed: 10})
      })

      test('should move backwards if steps are negative', () => {
        train.speed = -10
        const dest = getDestinationTile(train, -25, tiles)
        expect(dest).toEqual({ tilePosition: [0,0], step: 25, entryPoint: 'negY', speed: -10})
      })

      test('should NOT invert coordinates if entered through `to` side', () => {
        train.entryPoint = 'posY'
        const destForward = getDestinationTile(train, 25, tiles)
        expect(destForward).toEqual({ tilePosition: [0,0], step: 75, entryPoint: 'posY', speed: 10})

        train.speed = -10
        const destBackward = getDestinationTile(train, -25, tiles)
        expect(destBackward).toEqual({ tilePosition: [0,0], step: 25, entryPoint: 'posY', speed: -10})
      })
    })

    describe('next tile', () => {
      test('train facing forward, traveling forward', () => {
        const dest = getDestinationTile(train, 65, tiles)
        expect(dest).toEqual({ tilePosition: [0,1], step: 15, entryPoint: 'negY', speed: 10})
      })

      test('train facing forward, traveling backward', () => {
        train.speed = -10
        const dest = getDestinationTile(train, -65, tiles)
        expect(dest).toEqual({ tilePosition: [0,-1], step: 85, entryPoint: 'negY', speed: -10})
      })

      test('train facing forward, traveling backward, crossing into rotated tile', () => {
        train.speed = -10
        tiles['0,-1'].rotation = 180
        const dest = getDestinationTile(train, -65, tiles)
        expect(dest).toEqual({ tilePosition: [0,-1], step: 85, entryPoint: 'posY', speed: -10})
      })


      test('train facing backward, traveling forward', () => {
        train.entryPoint = 'posY'
        const dest = getDestinationTile(train, 65, tiles)
        expect(dest).toEqual({ tilePosition: [0,-1], step: 15, entryPoint: 'posY', speed: 10})
      })

      test('train facing backward, traveling backward', () => {
        train.entryPoint = 'posY'
        train.speed = -10
        const dest = getDestinationTile(train, -65, tiles)
        expect(dest).toEqual({ tilePosition: [0,1], step: 85, entryPoint: 'posY', speed: -10})
      })

      test('train facing backward, traveling backward, rotated tile', () => {
        train.entryPoint = 'posY'
        train.speed = -10
        tiles['0,1'].rotation = 180
        const dest = getDestinationTile(train, -65, tiles)
        expect(dest).toEqual({ tilePosition: [0,1], step: 85, entryPoint: 'negY', speed: -10})
      })

    })

    describe('two tile jump', () => {
      test('train facing forward, traveling forward', () => {
        const dest = getDestinationTile(train, 165, tiles)
        expect(dest).toEqual({ tilePosition: [0,2], step: 15, entryPoint: 'negX', speed: 10})
      })

      test('train facing forward, traveling backward', () => {
        train.speed = -10
        const dest = getDestinationTile(train, -165, tiles)
        expect(dest).toEqual({ tilePosition: [0,-2], step: QUARTER_ARC_LENGTH-15, entryPoint: 'negY', speed: -10})
      })

      test('train facing backward, traveling forward', () => {
        train.entryPoint = 'posY'
        const dest = getDestinationTile(train, 165, tiles)
        expect(dest).toEqual({ tilePosition: [0,-2], step: 15, entryPoint: 'negX', speed: 10})
      })

      test('train facing backward, traveling backward', () => {
        train.entryPoint = 'posY'
        train.speed = -10
        const dest = getDestinationTile(train, -165, tiles)
        expect(dest).toEqual({ tilePosition: [0,2], step: QUARTER_ARC_LENGTH-15, entryPoint: 'negY', speed: -10})
      })

    })

    describe('hits impassable point: next tile', () => {
      test('should stop prior to crossing into invalid tile', () => {
        tiles['0,1'].rotation = 90
        const destForward = getDestinationTile(train, 165, tiles)
        expect(destForward).toEqual({ tilePosition: [0,0], step: 100, entryPoint: 'negY', speed: 0})

        tiles['0,-1'].rotation = 90
        train.speed = -10
        const destBackward = getDestinationTile(train, -165, tiles)
        expect(destBackward).toEqual({ tilePosition: [0,0], step: 0, entryPoint: 'negY', speed: 0})
      })
    })


    describe('hits impassable point: multiple tiles down', () => {
      test('should stop prior to crossing into invalid tile', () => {
        tiles['0,2'].rotation = 180
        const destForward = getDestinationTile(train, 165, tiles)
        expect(destForward).toEqual({ tilePosition: [0,1], step: 100, entryPoint: 'negY', speed: 0})

        tiles['0,-2'].rotation = 0
        train.speed = -10
        const destBackward = getDestinationTile(train, -165, tiles)
        expect(destBackward).toEqual({ tilePosition: [0,-1], step: 0, entryPoint: 'negY', speed: 0})
      })
    })
  })
})
