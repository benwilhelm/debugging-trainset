import React, { useState } from 'react'
import TileBg from './ShapePrimitives/TileBg'
import { StraightTrack, CurvedTrack } from './ShapePrimitives'
import { TILE_WIDTH, TILE_HEIGHT } from '../../../constants'
import "./index.css"
import { ReactComponent as RotateIcon } from '../../../img/noun_Rotate_120470.svg'
import { ReactComponent as TrashIcon } from '../../../img/noun_Trash_2025448.svg'

const noop = () => {}

const TrackTile = ({ tile, deleteTile=noop, rotateTile=noop }) => {
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
      {/**
        * <g> stands for 'group'. A <g> allows you to group elements
        * together in order to apply transforms to all their children.
        * <g>'s themselves have no visible component.
        * They take CSS styles and register DOM events just like
        * any other DOM element. */}
      <g transform={`rotate(${rotation} ${TILE_WIDTH/2} ${TILE_HEIGHT/2})`}>
        <TileBg hovering={hovering} />

        {
          (tile.type === 'STRAIGHT') ? <StraightTrack rotation={rotation} />

          : (tile.type === 'CURVE') ? <CurvedTrack rotation={rotation} />

          : (tile.type === 'YLEFT') ? <>
            <CurvedTrack rotation={rotation + 90}  />
            <StraightTrack rotation={rotation}  />
          </>

          : (tile.type === 'YRIGHT') ? <>
            <CurvedTrack rotation={rotation} />
            <StraightTrack rotation={rotation} />
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
export default TrackTile
