import chroma from 'chroma-js'

export const TILE_WIDTH = 100
export const TILE_HEIGHT = 100

export const HALF_WIDTH = TILE_WIDTH / 2
export const HALF_HEIGHT = TILE_HEIGHT / 2

export const QUARTER_ARC_LENGTH = Math.PI * TILE_WIDTH / 4


export const COLOR_GRASS = "#595"
export const COLOR_GRASS_HOVER = chroma(COLOR_GRASS).darken().hex()
export const COLOR_TRACK_BED = "#DB5"
export const COLOR_RAIL = "#035"
export const COLOR_TIE = "#654"
export const TRACK_WIDTH = 15
export const TRACK_BED_WIDTH = 35
export const RAIL_WIDTH = 2
export const TIE_SPACING = 15
