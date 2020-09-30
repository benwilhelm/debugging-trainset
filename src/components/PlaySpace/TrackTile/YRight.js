import React from 'react'
import { TileBg, StraightTrack, CurvedTrack } from './ShapePrimitives'
import { TILE_WIDTH, TILE_HEIGHT} from '../../../constants'

export default ({rotation, hovering}) => (
  <g transform={`rotate(${rotation} ${TILE_WIDTH/2} ${TILE_HEIGHT/2})`}>
    <TileBg />
    <StraightTrack />
    <CurvedTrack />

    {hovering && (
      <rect x={10} y={10} width={15} height={10} />
    )}
  </g>
)
