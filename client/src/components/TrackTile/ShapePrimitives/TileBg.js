import React from 'react'
import { TILE_WIDTH, TILE_HEIGHT } from '../../../constants'


export default ({ hovering }) => {
  const fill = hovering ? "#ddd" : "#f0f0f0";
  return <rect width={TILE_WIDTH} height={TILE_HEIGHT} fill={fill} />
}
