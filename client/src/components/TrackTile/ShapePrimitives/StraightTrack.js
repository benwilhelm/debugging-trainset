import React from 'react'
import { TILE_WIDTH, TILE_HEIGHT} from '../../../constants'

export default ({rotation=0}) => (
  <g transform={`rotate(${rotation} ${TILE_WIDTH/2} ${TILE_HEIGHT/2})`}>
    <line
      x1={TILE_WIDTH/2}
      y1={0}
      x2={TILE_WIDTH/2}
      y2={TILE_HEIGHT}
      stroke="white"
      strokeWidth="9"
    />
    <line
      x1={TILE_WIDTH/2}
      y1={0}
      x2={TILE_WIDTH/2}
      y2={TILE_HEIGHT}
      stroke="black"
    />
  </g>
)
