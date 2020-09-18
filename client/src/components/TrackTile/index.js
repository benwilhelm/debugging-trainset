import React, { useState } from 'react'
import Straight from './Straight'
import Curve from './Curve'
import YLeft from './YLeft'
import YRight from './YRight'
import { TILE_WIDTH, TILE_HEIGHT } from '../../constants'
import Engine from '../Engine'

const noop = () => {}

export default ({ id, type, rotation, position, updateTile=noop }) => {
  const [ x, y ] = position
  const [ state, setState ] = useState({
    hovering: false
  })

  const rotateTile = () => updateTile({ id, rotation: (rotation+90) % 360})

  const Track = (type === 'STRAIGHT') ? Straight
              : (type === "CURVE")    ? Curve
              : (type === "YLEFT")    ? YLeft
              : (type === "YRIGHT")   ? YRight
              : () => <></>

  return (
    <svg
      x={x*TILE_WIDTH}
      y={y*TILE_HEIGHT}
      onMouseEnter={() => setState({ hovering: true })}
      onMouseLeave={() => setState({ hovering: false })}
    >
      <Track rotation={rotation} />
      {state.hovering && (
        <rect
          x={TILE_WIDTH/2 - 10}
          y={TILE_HEIGHT/2 - 10}
          width={20}
          height={20}
          onClick={rotateTile}
        />
      )}
    </svg>
  )
}

export { default as Straight } from "./Straight"
export { default as Curve } from "./Curve"
export { default as YLeft } from './YLeft'
export { default as YRight } from './YRight'
