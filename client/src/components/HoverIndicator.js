import React from 'react'
import { TILE_WIDTH, TILE_HEIGHT} from '../constants'
import { Straight, Curve } from './TrackSegment'

const noop = () => {}

export default ({tileCoords, insertTile=noop}) => {
  const [ x, y ] = tileCoords
  const newTile = (type) => ({ type, rotation: 0, position: tileCoords })

  return (
    <svg x={x*TILE_WIDTH} y={y*TILE_HEIGHT} width={TILE_WIDTH} height={TILE_HEIGHT}>


      <rect
        x={0}
        y={0}
        width={TILE_WIDTH}
        height={TILE_HEIGHT}
        fill="#ddd"
      />

      <g transform="scale(0.4)">
        <g onClick={() => insertTile(newTile("STRAIGHT"))}
           transform={`translate(${0.1*TILE_WIDTH}, ${0.5*TILE_HEIGHT})`}
        >
          <Straight rotation={0} />
        </g>

        <g onClick={() => insertTile(newTile("CURVE"))}
           transform={`translate(${1.2*TILE_WIDTH}, ${0.5*TILE_HEIGHT})`}
        >
          <Curve rotation={0} />
        </g>

      </g>

    </svg>
  )
}
