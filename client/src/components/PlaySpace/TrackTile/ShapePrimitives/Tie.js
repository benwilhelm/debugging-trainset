import React from 'react'
import { COLOR_TIE, TRACK_BED_WIDTH } from '../../../../constants'

const TIE_LENGTH = TRACK_BED_WIDTH - 14
const TIE_WIDTH = 6

export default ({x, y, rotation=0}) => {
  return <g transform={`rotate(${rotation} ${x} ${y})`}>
    <line
      x1={ x - (TIE_LENGTH/2) }
      y1={ y }
      x2={ x + (TIE_LENGTH/2) }
      y2={ y }
      stroke={COLOR_TIE}
      strokeWidth={TIE_WIDTH}
    />
  </g>
}
