import React from 'react'
import Tie from './Tie'
import { cartesianFromPolar, degreesFromRadians } from '../../../../util'
import { range } from 'lodash'
import {
  TILE_WIDTH,
  TILE_HEIGHT,
  HALF_WIDTH,
  QUARTER_ARC_LENGTH,
  TRACK_WIDTH,
  TRACK_BED_WIDTH,
  COLOR_TRACK_BED,
  COLOR_RAIL,
  RAIL_WIDTH,
  TIE_SPACING,
} from '../../../../constants'

const RAIL_INNER_R = TILE_WIDTH/2 - TRACK_WIDTH/2
const RAIL_OUTER_R = TILE_WIDTH/2 + TRACK_WIDTH/2

const TRUE_TIE_SPACING = QUARTER_ARC_LENGTH / Math.floor(QUARTER_ARC_LENGTH/TIE_SPACING)

const CurvedTrack = ({ rotation=0 }) => (
  <g transform={`rotate(${rotation} ${TILE_WIDTH/2} ${TILE_HEIGHT/2})`}>
    <path d={`
      M ${TILE_WIDTH/2} 0
      A ${TILE_HEIGHT/2} ${TILE_HEIGHT/2} 0 0 1 ${0} ${TILE_HEIGHT/2}`}
      stroke={COLOR_TRACK_BED}
      strokeWidth={TRACK_BED_WIDTH}
      fill="none"
    />


    {range(
      TRUE_TIE_SPACING / 2, // first tie
      QUARTER_ARC_LENGTH, // extent of ties
      TRUE_TIE_SPACING, // interval for range
    ).map(l => {
      const r = HALF_WIDTH
      const theta = l / r
      const [ x, y ] = cartesianFromPolar([r, theta])
      return <Tie key={l} x={x} y={y} rotation={degreesFromRadians(theta)} />
    })}


    <path d={`
      M ${RAIL_INNER_R} 0
      A ${RAIL_INNER_R} ${RAIL_INNER_R} 0 0 1 ${0} ${RAIL_INNER_R}`}
      stroke={COLOR_RAIL}
      fill="none"
      strokeWidth={RAIL_WIDTH}
    />

    <path d={`
      M ${RAIL_OUTER_R} 0
      A ${RAIL_OUTER_R} ${RAIL_OUTER_R} 0 0 1 ${0} ${RAIL_OUTER_R}`}
      stroke={COLOR_RAIL}
      fill="none"
      strokeWidth={RAIL_WIDTH}
    />

  </g>
)
export default CurvedTrack
