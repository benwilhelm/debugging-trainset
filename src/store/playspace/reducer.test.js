import { Train, Tile } from '../../models'
import reducer, { initialState } from './reducer'
import * as actions from './actions'
import { keyBy } from 'lodash'

describe('playspace reducer', () => {
  let trains
  let tiles
  let emptyState
  let populatedState

  beforeEach(() => {
    trains = [
      new Train({ tilePosition: [2, 1], tileDirection: 1, step: 50 }),
      new Train({ tilePosition: [3, 1], tileDirection: 1, step: 50 }),
    ]

    tiles = [
      new Tile({ type: "STRAIGHT", position: [1, 1] }),
      new Tile({ type: "STRAIGHT", position: [2, 1] }),
      new Tile({ type: "STRAIGHT", position: [3, 1] }),
      new Tile({ type: "STRAIGHT", position: [4, 1] }),
    ]

    emptyState = {...initialState}
    populatedState = {
      trains: keyBy(trains, 'id'),
      tiles: keyBy(tiles, tile => tile.position.toString())
    }
  })

  describe('INSERT_TRAIN', () => {
    test('shoud add train to trains object', () => {
      const train = trains[0]
      const state = reducer(initialState, {
        type: actions.INSERT_TRAIN,
        payload: train
      })
      expect(state.trains[train.id]).toEqual(train)
    })
  })

  describe('UPDATE_TRAIN', () => {
    test('should update train with passed params', () => {
      const train = trains[0]
      const otherTrain = trains[1]
      const state = reducer(populatedState, {
        type: actions.UPDATE_TRAIN,
        payload: {
          id: train.id,
          speed: 30
        }
      })

      expect(state.trains[train.id].speed).toEqual(30)
      expect(state.trains[otherTrain.id].speed).toEqual(0)
    })

    test.todo('should throw if params have no ID')
    test.todo('should throw if bad ID')
  })

  describe("STOP_TRAIN", () => {
    test.todo('should set train speed to 0')
    test.todo('should throw if bad ID')
  })
})
