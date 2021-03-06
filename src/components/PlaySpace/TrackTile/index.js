import React, { useState } from 'react'
import TileBg from './ShapePrimitives/TileBg'
import Straight from './ShapePrimitives/StraightTrack'
import Curve from './ShapePrimitives/CurvedTrack'
import { TILE_WIDTH, TILE_HEIGHT } from '../../../constants'
import "./index.css"
import { ReactComponent as RotateIcon } from '../../../img/noun_Rotate_120470.svg'
import { ReactComponent as TrainIcon } from '../../../img/noun_Train_81514.svg'
import { ReactComponent as TrashIcon } from '../../../img/noun_Trash_2025448.svg'

const noop = () => {}

const TrackTile = ({ tile, updateTile=noop, toggleSegment=noop, deleteTile=noop, rotateTile=noop, insertTrain=noop }) => {
  const { rotation, position, segments } = tile
  const [ x, y ] = position
  const [ hovering, setHovering ] = useState(false)

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
        {sorted.map((segment) => (
          <Segment  key={`${tile.id}-${segment.type}`} segment={segment} />
        ))}

        {segments.length > 1 && hovering &&
          <SegmentToggle toggleSegment={() => toggleSegment(tile)} />
        }
      </g>


      {hovering && (
        <TileControls
          rotateTile={() => rotateTile(tile)}
          deleteTile={() => deleteTile(tile)}
          insertTrain={() => insertTrain(tile)}
        />
      )}
    </svg>
  )
}
export default TrackTile



const Segment = ({ segment }) => (
  (segment.type === 'STRAIGHT') ? <Straight rotation={segment.rotation} />
  : (segment.type === 'CURVE') ? <Curve rotation={segment.rotation} />
  : <></>
)

const SegmentToggle = ({ toggleSegment }) => (
  <text className="tile-control"
    x={TILE_WIDTH / 2}
    y={10}
    width={15}
    height={15}
    dominantBaseline='middle'
    textAnchor='middle'
    transform='rotate(90 50 10)'
    fill="white"
    onClick={toggleSegment}
  >{'\u292e'}</text>
)

const TileControls = ({ rotateTile, deleteTile, insertTrain }) => (
  <>
    <RotateIcon className="tile-control"
      x={TILE_WIDTH/2 - 10}
      y={TILE_HEIGHT/2 - 10}
      width={20}
      height={20}
      fill="white"
      onClick={rotateTile}
    />

    <TrashIcon className="tile-control"
      x={TILE_WIDTH - 30}
      y={TILE_HEIGHT - 30}
      width={20}
      height={20}
      fill="white"
      onClick={deleteTile}
    />

    <TrainIcon className="tile-control"
      x={10}
      y={TILE_HEIGHT - 30}
      width={20}
      height={20}
      fill="white"
      onClick={insertTrain}
    />
  </>
)
