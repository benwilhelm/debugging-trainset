import React, { useState, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import TrackSegment from './TrackSegment'
import HoverIndicator from './HoverIndicator'
import trackSetData from '../data/trackset'
import { TILE_WIDTH, TILE_HEIGHT } from '../constants'


export default () => {
  const [tiles, setTiles] = useState(trackSetData)
  const [viewBox, setViewBox] = useState([0, 0, 800, 800])
  const [ tileCoords, setTileCoords ] = useState([0, 0])
  const svgEl = useRef(null)

  const updateTile = (tile) => {
    setTiles(allTiles => allTiles.map(t => t.id === tile.id ? {...t, ...tile} : t))
  }

  const insertTile = (tile) => {
    const id = uuid()
    setTiles(allTiles => [...allTiles, { ...tile, id }])
  }

  const handleMouseMove = (evt) => {
    const pt = svgEl.current.createSVGPoint()
    pt.x = evt.clientX
    pt.y = evt.clientY

    const { x, y } = pt.matrixTransform(svgEl.current.getScreenCTM().inverse())
    setTileCoords([
      Math.floor(x / TILE_WIDTH),
      Math.floor(y / TILE_HEIGHT)
    ])
  }

  return (
    <svg ref={svgEl}
         viewBox={viewBox.join(' ')} xmlns="http://www.w3.org/2000/svg"
         onMouseMove={handleMouseMove}
    >
      <HoverIndicator tileCoords={tileCoords} insertTile={insertTile} />
      {tiles.map((tile) => (
        <TrackSegment key={tile.id} {...tile} updateTile={updateTile} />
      ))}
    </svg>
  )
}
