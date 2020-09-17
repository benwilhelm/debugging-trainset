import React from 'react'
import { TILE_WIDTH, TILE_HEIGHT } from '../../constants'

export default ({rotation}) => (
  <g transform={`rotate(${rotation} ${TILE_WIDTH/2} ${TILE_HEIGHT/2})`}>
    <rect x={0} y={0} width={TILE_WIDTH} height={TILE_HEIGHT} fill="#f7f7f7" />

    <path d={`
      M ${TILE_WIDTH/2} 0
      A ${TILE_HEIGHT/2} ${TILE_HEIGHT/2} 0 0 1 ${0} ${TILE_HEIGHT/2}`}
      stroke="black"
      fill="none"
    />
  </g>
)
