import React, { useState } from 'react'
import TileBg from './ShapePrimitives/TileBg'
import Straight from './ShapePrimitives/StraightTrack'
import Curve from './ShapePrimitives/CurvedTrack'
import { TILE_WIDTH, TILE_HEIGHT } from '../../constants'
import "./index.css"

const noop = () => {}

export default ({ tile, updateTile=noop, toggleSegment=noop, deleteTile=noop }) => {
  const { type, rotation, position, segments } = tile
  const [ x, y ] = position
  const [ hovering, setHovering ] = useState(false)

  const rotateTile = () => updateTile(position, { rotation: (rotation+90) % 360})

  const selected = segments[tile.selectedSegment]
  const unselected = segments.filter((seg, idx) => idx !== tile.selectedSegment)
  const sorted = [...unselected, selected]

  return (
    <svg className="tile"
      x={x*TILE_WIDTH}
      y={y*TILE_HEIGHT}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <g transform={`rotate(${rotation} ${TILE_WIDTH/2} ${TILE_HEIGHT/2})`}>
        <TileBg hovering={hovering} />
        {sorted.map((seg) => (
          (seg.type === 'STRAIGHT') ? <Straight key={`${tile.id}-${seg.type}`} rotation={seg.rotation} />
          : (seg.type === 'CURVE') ? <Curve key={`${tile.id}-${seg.type}`} rotation={seg.rotation} />
          : <></>
        ))}

        {segments.length > 1 && hovering &&
          <text className="tile-control"
            x={TILE_WIDTH / 2}
            y={10}
            width={15}
            height={15}
            dominantBaseline='middle'
            textAnchor='middle'
            transform='rotate(90 50 10)'
            onClick={() => toggleSegment(tile.position)}
          >{'\u292e'}</text>
        }

      </g>


      {hovering && (
        <>
          <text className="tile-control"
            x={TILE_WIDTH/2}
            y={TILE_HEIGHT/2}
            width={20}
            height={20}
            dominantBaseline='middle'
            textAnchor='middle'
            onClick={rotateTile}
          >{'\u27f3'}</text>

          <text className="tile-control"
            x={TILE_WIDTH - 20}
            y={TILE_HEIGHT - 20}
            width={20}
            height={20}
            dominantBaseline='middle'
            textAnchor='middle'
            onClick={() => deleteTile(tile)}
          >{'\u274c'}</text>

        </>
      )}
    </svg>
  )
}

export { default as Straight } from "./Straight"
export { default as Curve } from "./Curve"
export { default as YLeft } from './YLeft'
export { default as YRight } from './YRight'
