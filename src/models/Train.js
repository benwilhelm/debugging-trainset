import { v4 as uuid } from 'uuid'

const colorSchemes = [
  { main: '#b4b', dark: "#606"},
  { main: '#4bb', dark: "#066"},
  { main: '#a55', dark: "#600"},
  { main: '#5a5', dark: "#060"},
  { main: '#55a', dark: "#006"},
  { main: '#bb4', dark: "#660"},
]

let currentColorSchemeIndex = 0
const getColorScheme = () => {
  const scheme = colorSchemes[currentColorSchemeIndex]
  currentColorSchemeIndex = (currentColorSchemeIndex + 1) % colorSchemes.length
  return scheme
}

export default class Train {
  constructor({id, tilePosition, entryPoint, colors, speed=0, step=0, highlight=false, cars=3 }) {
    this.id = id || uuid()
    this.tilePosition = tilePosition
    this.entryPoint = entryPoint
    this.speed = speed
    this.step = step
    this.colors = colors || getColorScheme()
    this.highlight = highlight
    this.cars = cars
  }
}
