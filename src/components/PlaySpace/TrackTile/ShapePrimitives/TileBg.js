import React from 'react'
import { TILE_WIDTH, TILE_HEIGHT, COLOR_GRASS, COLOR_GRASS_HOVER } from '../../../../constants'

const TileBg = ({ hovering }) => {
  const fill = hovering ? COLOR_GRASS_HOVER : COLOR_GRASS;
  return <rect width={TILE_WIDTH} height={TILE_HEIGHT} fill={fill} />
}
export default TileBg
