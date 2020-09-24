/**
 * Making all functions async, even though localstorage is synchronous,
 * so that if we change over to a different (asynchronous) storage machanism
 * such as an HTTP API, we don't have to change the interface
 */

export const saveTileData = async (tiles) => {
  return localStorage.setItem('tiles', JSON.stringify(tiles))
}

export const loadTileData = async () => {
  return JSON.parse(localStorage.getItem('tiles'))
}
