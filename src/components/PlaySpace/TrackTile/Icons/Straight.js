import React from 'react'
import { TileBg, StraightTrack } from '../ShapePrimitives'
import { TILE_WIDTH, TILE_HEIGHT} from '../../../../constants'

const StraightIcon = ({rotation}) => (
  <g transform={`rotate(${rotation} ${TILE_WIDTH/2} ${TILE_HEIGHT/2})`}>
    <TileBg />
    <StraightTrack />
  </g>
)
export default StraightIcon
