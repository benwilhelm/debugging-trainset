import React from 'react'
import { TILE_WIDTH, TILE_HEIGHT } from '../../../constants'

export default ({ rotation=0 }) => (
  <g transform={`rotate(${rotation} ${TILE_WIDTH/2} ${TILE_HEIGHT/2})`}>
    <path d={`
      M ${TILE_WIDTH/2} 0
      A ${TILE_HEIGHT/2} ${TILE_HEIGHT/2} 0 0 1 ${0} ${TILE_HEIGHT/2}`}
      stroke="white"
      strokeWidth="9"
      fill="none"
    />
    <path d={`
      M ${TILE_WIDTH/2} 0
      A ${TILE_HEIGHT/2} ${TILE_HEIGHT/2} 0 0 1 ${0} ${TILE_HEIGHT/2}`}
      stroke="#555555"
      fill="none"
    />
  </g>
)
