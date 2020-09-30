import React from 'react'
import { TILE_WIDTH, TILE_HEIGHT } from '../../../constants'
import { TileBg, CurvedTrack } from './ShapePrimitives'

export default ({rotation}) => (
  <g transform={`rotate(${rotation} ${TILE_WIDTH/2} ${TILE_HEIGHT/2})`}>
    <TileBg />
    <CurvedTrack />
  </g>
)
