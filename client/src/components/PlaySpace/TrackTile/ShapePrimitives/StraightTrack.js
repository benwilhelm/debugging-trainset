import React from 'react'
import { range } from 'lodash'
import Tie from './Tie'
import {
  TILE_WIDTH,
  TILE_HEIGHT,
  TRACK_WIDTH,
  TRACK_BED_WIDTH,
  COLOR_TRACK_BED,
  RAIL_WIDTH,
  TIE_SPACING,
  COLOR_RAIL,
} from '../../../../constants'

const RAIL_LEFT_X = TILE_WIDTH/2 - TRACK_WIDTH/2
const RAIL_RIGHT_X = TILE_WIDTH/2 + TRACK_WIDTH/2

// Plotting ties evenly across the tile, so there is no
// bunching or gaps at tile seams
const TRUE_TIE_SPACING = TILE_HEIGHT / Math.floor(TILE_HEIGHT/TIE_SPACING)

export default ({rotation=0}) => (
  <g transform={`rotate(${rotation} ${TILE_WIDTH/2} ${TILE_HEIGHT/2})`}>
    <line
      x1={TILE_WIDTH/2}
      y1={0}
      x2={TILE_WIDTH/2}
      y2={TILE_HEIGHT}
      stroke={COLOR_TRACK_BED}
      strokeWidth={TRACK_BED_WIDTH}
    />

    { range( TRUE_TIE_SPACING/2, TILE_HEIGHT, TRUE_TIE_SPACING ).map(
      y => <Tie key={y} x={TILE_WIDTH/2} y={y} />
    )}

    <line
      x1={RAIL_LEFT_X}
      y1={0}
      x2={RAIL_LEFT_X}
      y2={TILE_HEIGHT}
      stroke={COLOR_RAIL}
      strokeWidth={RAIL_WIDTH}
    />
    <line
      x1={RAIL_RIGHT_X}
      y1={0}
      x2={RAIL_RIGHT_X}
      y2={TILE_HEIGHT}
      stroke={COLOR_RAIL}
      strokeWidth={RAIL_WIDTH}
    />
  </g>
)
