import { v4 as uuid } from 'uuid'

export default class Engine {
  constructor({id, tilePosition, entryPoint, speed=0, step=0}) {
    this.id = id || uuid()
    this.tilePosition = tilePosition
    this.entryPoint = entryPoint
    this.speed = speed
    this.step = step
  }
}
