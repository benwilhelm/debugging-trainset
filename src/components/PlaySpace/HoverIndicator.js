import React from 'react'
import { TILE_WIDTH, TILE_HEIGHT, COLOR_GRASS_HOVER} from '../../constants'
import { IconStraight, IconCurve, IconYLeft, IconYRight } from './TrackTile/Icons'
import './HoverIndicator.css'

const noop = () => {}

const HoverIndicator = ({tilePosition, insertTile=noop}) => {
  const [ x, y ] = tilePosition
  const newTile = (type) => ({ type, rotation: 0, position: tilePosition })

  // This component is rendered by the PlaySpace component, which itself
  // returns an SVG.
  // Notice that we are returning an SVG here. Nesting SVGs is totally valid.
  // The x/y/width/height attributes determine the height of this component
  // relative to the parent SVG's coordinate space
  return (
    <svg x={x*TILE_WIDTH} y={y*TILE_HEIGHT} width={TILE_WIDTH} height={TILE_HEIGHT}>

      <rect
        x={0}
        y={0}
        width={TILE_WIDTH}
        height={TILE_HEIGHT}
        fill={COLOR_GRASS_HOVER}
      />

      {/**
        * <g> stands for 'group'. A <g> allows you to group elements
        * together in order to apply transforms to all their children.
        * <g>'s themselves have no visible component.
        * They take CSS styles and register DOM events just like
        * any other DOM element. */}
      <g transform="scale(0.4)">
        <g onClick={() => newTile("STRAIGHT")}
           transform={`translate(${0.1*TILE_WIDTH}, ${0.1*TILE_HEIGHT})`}
           style={{cursor: 'pointer'}}
        >
          <IconStraight rotation={0} />
        </g>

        <g onClick={() => newTile("CURVE")}
           transform={`translate(${1.4*TILE_WIDTH}, ${0.1*TILE_HEIGHT})`}
           style={{cursor: 'pointer'}}
        >
          <IconCurve rotation={0} />
        </g>

        <g onClick={() => newTile("YLEFT")}
           transform={`translate(${0.1*TILE_WIDTH}, ${1.4*TILE_HEIGHT})`}
           style={{cursor: 'pointer'}}
        >
          <IconYLeft rotation={0} />
        </g>

        <g onClick={() => newTile("YRIGHT")}
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
