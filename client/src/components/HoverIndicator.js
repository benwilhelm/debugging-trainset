import React from 'react'
import { TILE_WIDTH, TILE_HEIGHT, COLOR_GRASS_HOVER} from '../constants'
import { Straight, Curve, YLeft, YRight } from './TrackTile'
import './HoverIndicator.css'

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
        fill={COLOR_GRASS_HOVER}
      />

      <g transform="scale(0.4)">
        <g onClick={() => insertTile(newTile("STRAIGHT"))}
           transform={`translate(${0.1*TILE_WIDTH}, ${0.1*TILE_HEIGHT})`}
           style={{cursor: 'pointer'}}
        >
          <Straight rotation={0} />
        </g>

        <g onClick={() => insertTile(newTile("CURVE"))}
           transform={`translate(${1.4*TILE_WIDTH}, ${0.1*TILE_HEIGHT})`}
           style={{cursor: 'pointer'}}
        >
          <Curve rotation={0} />
        </g>

        <g onClick={() => insertTile(newTile("YLEFT"))}
           transform={`translate(${0.1*TILE_WIDTH}, ${1.4*TILE_HEIGHT})`}
           style={{cursor: 'pointer'}}
        >
          <YLeft rotation={0} />
        </g>

        <g onClick={() => insertTile(newTile("YRIGHT"))}
           transform={`translate(${1.4*TILE_WIDTH}, ${1.4*TILE_HEIGHT})`}
           style={{cursor: 'pointer'}}
        >
          <YRight rotation={0} />
        </g>

      </g>

    </svg>
  )
}
