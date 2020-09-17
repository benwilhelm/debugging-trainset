import React from 'react'
import { TILE_WIDTH, TILE_HEIGHT} from '../../constants'

export default ({rotation}) => (
  <g transform={`rotate(${rotation} ${TILE_WIDTH/2} ${TILE_HEIGHT/2})`}>
    <rect x={0} y={0} width={TILE_WIDTH} height={TILE_HEIGHT} fill="#f7f7f7" />
    <line
      x1="0"
      y1={TILE_HEIGHT/2}
      x2={TILE_WIDTH}
      y2={TILE_HEIGHT/2}
      stroke="black"
    />
  </g>
)
