import React, { useState } from 'react'
import TileBg from './ShapePrimitives/TileBg'
import { StraightTrack, CurvedTrack } from './ShapePrimitives'
import { TILE_WIDTH, TILE_HEIGHT } from '../../../constants'
import "./index.css"
import { ReactComponent as RotateIcon } from '../../../img/noun_Rotate_120470.svg'
import { ReactComponent as TrashIcon } from '../../../img/noun_Trash_2025448.svg'

const noop = () => {}

export default ({ tile, deleteTile=noop, rotateTile=noop }) => {
  const { rotation, position } = tile
  const [ x, y ] = position
  const [ hovering, setHovering ] = useState(false)

  return (
    <svg className="tile"
      x={x*TILE_WIDTH}
      y={y*TILE_HEIGHT}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <g transform={`rotate(${rotation} ${TILE_WIDTH/2} ${TILE_HEIGHT/2})`}>
        <TileBg hovering={hovering} />

        {
          (tile.type === 'STRAIGHT') ? <StraightTrack rotation={0} />

          : (tile.type === 'CURVE') ? <CurvedTrack rotation={0} />

          : (tile.type === 'YLEFT') ? <>
            <CurvedTrack rotation={90}  />
            <StraightTrack rotation={0}  />
          </>

          : (tile.type === 'YRIGHT') ? <>
            <CurvedTrack rotation={0} />
            <StraightTrack rotation={0} />
          </>

          : <></>
        }
      </g>


      {hovering && (
        <>
          <RotateIcon className="tile-control"
            x={TILE_WIDTH/2 - 10}
            y={TILE_HEIGHT/2 - 10}
            width={20}
            height={20}
            fill="white"
            onClick={() => rotateTile(tile)}
          />

          <TrashIcon className="tile-control"
            x={TILE_WIDTH - 30}
            y={TILE_HEIGHT - 30}
            width={20}
            height={20}
            fill="white"
            onClick={() => deleteTile(tile)}
          />

        </>
      )}
    </svg>
  )
}
