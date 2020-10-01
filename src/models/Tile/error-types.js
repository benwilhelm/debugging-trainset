export class TileDirectionError extends Error {
  constructor(message) {
    super(message)
    this.name = "TileDirectionError"
  }
}

export class TileExtentError extends Error {
  constructor(message) {
    super(message)
    this.name = "TileExtentError"
  }
}
