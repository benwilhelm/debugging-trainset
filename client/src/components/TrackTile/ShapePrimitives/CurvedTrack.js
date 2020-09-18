import React from 'react'
import { TILE_WIDTH, TILE_HEIGHT } from '../../../constants'

export default () => (
  <path d={`
    M ${TILE_WIDTH/2} 0
    A ${TILE_HEIGHT/2} ${TILE_HEIGHT/2} 0 0 1 ${0} ${TILE_HEIGHT/2}`}
    stroke="black"
    fill="none"
  />

)
