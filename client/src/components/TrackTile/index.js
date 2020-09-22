import React, { useState } from 'react'
import TileBg from './ShapePrimitives/TileBg'
import Straight from './ShapePrimitives/StraightTrack'
import Curve from './ShapePrimitives/CurvedTrack'
import { TILE_WIDTH, TILE_HEIGHT } from '../../constants'

const noop = () => {}

export default ({ tile, updateTile=noop, toggleSegment=noop }) => {
  const { type, rotation, position, segments } = tile
  const [ x, y ] = position
  const [ state, setState ] = useState({
    hovering: false
  })

  const rotateTile = () => updateTile(position, { rotation: (rotation+90) % 360})

  const selected = segments[tile.selectedSegment]
  const unselected = segments.filter((seg, idx) => idx !== tile.selectedSegment)
  const sorted = [...unselected, selected]

  return (
    <svg
      x={x*TILE_WIDTH}
      y={y*TILE_HEIGHT}
      onMouseEnter={() => setState({ hovering: true })}
      onMouseLeave={() => setState({ hovering: false })}
    >
      <g transform={`rotate(${rotation} ${TILE_WIDTH/2} ${TILE_HEIGHT/2})`}>
        <TileBg />
        {sorted.map((seg) => (
          (seg.type === 'STRAIGHT') ? <Straight key={`${tile.id}-${seg.type}`} rotation={seg.rotation} />
          : (seg.type === 'CURVE') ? <Curve key={`${tile.id}-${seg.type}`} rotation={seg.rotation} />
          : <></>
        ))}
      </g>


      {state.hovering && (
        <>
          <rect
            x={TILE_WIDTH/2 - 10}
            y={TILE_HEIGHT/2 - 10}
            width={20}
            height={20}
            onClick={rotateTile}
          />

          <rect
            x={10}
            y={10}
            width={20}
            height={20}
            onClick={() => toggleSegment(tile.position)}
          />
        </>
      )}
    </svg>
  )
}

export { default as Straight } from "./Straight"
export { default as Curve } from "./Curve"
export { default as YLeft } from './YLeft'
export { default as YRight } from './YRight'
