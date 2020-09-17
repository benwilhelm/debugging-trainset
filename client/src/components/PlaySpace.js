import React, { useState, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import TrackTile from './TrackTile'
import HoverIndicator from './HoverIndicator'
import trackSetData from '../data/trackset'
import { TILE_WIDTH, TILE_HEIGHT } from '../constants'


function pageCoordsToSvgCoords(pageCoords, svg) {
  const [ pageX, pageY ] = pageCoords
  const pt = svg.createSVGPoint()
  pt.x = pageX
  pt.y = pageY
  const { x, y } = pt.matrixTransform(svg.getScreenCTM().inverse())
  return [ x, y ]
}

export default () => {
  const [tiles, setTiles] = useState(trackSetData)
  const [viewBox, setViewBox] = useState([0, 0, 800, 400])
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
    const [x, y] = pageCoordsToSvgCoords([evt.clientX, evt.clientY], svgEl.current)
    setTileCoords([
      Math.floor(x / TILE_WIDTH),
      Math.floor(y / TILE_HEIGHT)
    ])
  }

  const handleMouseWheel = (e) => {
    const [ pointerX, pointerY ] = pageCoordsToSvgCoords([e.clientX, e.clientY], svgEl.current)
    const [ x, y, w, h ] = viewBox
    const weightX = (pointerX - x) / w
    const weightY = (pointerY - y) / h

    const factor = (e.deltaY > 0)
                 ? 1 + (0.001 * e.deltaY)
                 : 1 - (0.001 * Math.abs(e.deltaY))

    const newW = w * factor
    const newH = h * factor

    const newX = x - ((newW - w) * weightX)
    const newY = y - ((newH - h) * weightY)
    requestAnimationFrame(() => setViewBox([ newX, newY, newW, newH ]))
  }

  return (
    <svg ref={svgEl}
         style={{border: '1px solid blue'}}
         viewBox={viewBox.join(' ')} xmlns="http://www.w3.org/2000/svg"
         onMouseMove={handleMouseMove}
         onWheel={handleMouseWheel}
    >
      <HoverIndicator tileCoords={tileCoords} insertTile={insertTile} />
      {tiles.map((tile) => (
        <TrackTile key={tile.id} {...tile} updateTile={updateTile} />
      ))}
    </svg>
  )
}
