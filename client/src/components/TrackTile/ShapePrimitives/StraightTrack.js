import React from 'react'
import { TILE_WIDTH, TILE_HEIGHT} from '../../../constants'

export default () => <line
  x1={TILE_WIDTH/2}
  y1={0}
  x2={TILE_WIDTH/2}
  y2={TILE_HEIGHT}
  stroke="black"
/>
