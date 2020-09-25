import Tile from '../models/Tile'
import Engine from '../models/Engine'
import {
  TILE_WIDTH,
  TILE_HEIGHT,
  HALF_WIDTH,
  HALF_HEIGHT,
  QUARTER_ARC_LENGTH
} from '../constants'
import { getNextLocation } from './playspace'

const tileSpace = {
  "-1,-1": new Tile({ position: [ -1, -1 ], rotation: 90, type: 'STRAIGHT' }),
  "0,-1": new Tile({ position: [  0, -1 ], rotation: 270, type: 'CURVE' }),
  "0,0": new Tile({ position: [  0, 0 ], rotation: 0, type: 'STRAIGHT' }),
  "0,1": new Tile({ position: [  0, 1 ], rotation: 0, type: 'CURVE' }),
  "-1,1": new Tile({ position: [ -1, 1 ], rotation: 90, type: 'STRAIGHT' }),
}

describe('playspace reducer', () => {
  describe("getNextLocation()", () => {
    test("should advance engine specified number of steps", () => {
      const engine = new Engine({
        coordinates: [HALF_WIDTH, 10],
        entryPoint: "negY",
        step: 10
      })

      const forward = getNextLocation(engine, tileSpace, 1)
      expect(forward.location.point).toEqual([HALF_WIDTH, 11])
      expect(forward.location.rotation).toEqual(0)

      const backward = getNextLocation(engine, tileSpace, -5)
      expect(backward.location.point).toEqual([HALF_WIDTH, 5])
      expect(backward.location.rotation).toEqual(0)

    })

    test("should pass off to next tile: forward", () => {
      const engine = new Engine({
        coordinates: [HALF_WIDTH, 10],
        entryPoint: "negY",
        step: 10,
        speed: 10
      })
      const forwardDest = tileSpace["0,1"].travelFunction(10, 'negY')
      const forward = getNextLocation(engine, tileSpace, TILE_HEIGHT)
      expect(forward.location.point).toEqual(forwardDest.point)
      expect(forward.location.rotation).toEqual(forwardDest.rotation)
    })

    test.only("should recurse through multiple tiles", () => {
      const engine = new Engine({
        coordinates: [HALF_WIDTH, 10],
        entryPoint: "negY",
        step: 10,
        speed: 10
      })
      const forwardDest = tileSpace["-1,1"].travelFunction(10, 'negY')
      const forward = getNextLocation(engine, tileSpace, TILE_HEIGHT + QUARTER_ARC_LENGTH)
      expect(forward.location.point).toEqual(forwardDest.point)
      expect(forward.location.rotation).toEqual(forwardDest.rotation)
    })

    test("should pass off to next tile: backward", () => {
      const engine = new Engine({
        coordinates: [HALF_WIDTH, 10],
        entryPoint: "negY",
        step: 10,
        speed: 10
      })
      const backwardDest = tileSpace["0,-1"].travelFunction( QUARTER_ARC_LENGTH-10, 'negX')
      const backward = getNextLocation(engine, tileSpace, -20)
      expect(backward.location.point).toEqual(backwardDest.point)
      expect(backward.location.rotation).toEqual(backwardDest.rotation)
    })
  })
})
