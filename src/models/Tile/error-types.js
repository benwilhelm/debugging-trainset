export class EntryPointError extends Error {
  constructor(message) {
    super(message)
    this.name = "EntryPointError"
  }
}

export class TileExtentError extends Error {
  constructor(message) {
    super(message)
    this.name = "TileExtentError"
  }
}
