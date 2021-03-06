import React from 'react'
import { TILE_WIDTH, TILE_HEIGHT, COLOR_GRASS_HOVER} from '../../../constants'
import { IconStraight, IconCurve, IconYLeft, IconYRight } from '../TrackTile/Icons'
import './index.css'

const noop = () => {}

const HoverIndicator = ({tilePosition, insertTile=noop}) => {
  const [ x, y ] = tilePosition
  const newTile = (type) => ({ type, rotation: 0, position: tilePosition })

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
          <IconStraight rotation={0} />
        </g>

        <g onClick={() => insertTile(newTile("CURVE"))}
           transform={`translate(${1.4*TILE_WIDTH}, ${0.1*TILE_HEIGHT})`}
           style={{cursor: 'pointer'}}
        >
          <IconCurve rotation={0} />
        </g>

        <g onClick={() => insertTile(newTile("YLEFT"))}
           transform={`translate(${0.1*TILE_WIDTH}, ${1.4*TILE_HEIGHT})`}
           style={{cursor: 'pointer'}}
        >
          <IconYLeft rotation={0} />
        </g>

        <g onClick={() => insertTile(newTile("YRIGHT"))}
           transform={`translate(${1.4*TILE_WIDTH}, ${1.4*TILE_HEIGHT})`}
           style={{cursor: 'pointer'}}
        >
          <IconYRight rotation={0} />
        </g>

      </g>

    </svg>
  )
}
export default HoverIndicator
