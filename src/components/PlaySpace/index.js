import React, { useState, useRef, useEffect } from 'react'
import TrackTile from './TrackTile'
import HoverIndicator from './HoverIndicator'
import { v4 as uuid } from 'uuid'
import { TILE_WIDTH, TILE_HEIGHT, COLOR_GRASS } from '../../constants'
import { pageCoordsToSvgCoords } from '../../util'

/**
 * The CRUD operations for all the track tiles are contained within this
 * custom React hook. */
const useTiles = () => {
  const [ tiles, setTiles ] = useState({})

  const insertTile = (tile) => {
    setTiles(tiles => {
      const id = uuid()
      return { ...tiles, [id]: { ...tile, id }}
    }
  )}

  const deleteTile = (tile) => setTiles(tiles => {
    delete tiles[tile.id]
    return {...tiles}
  })

  const updateTile = (params) => setTiles(tiles => {
    const tile = tiles[params.id]
    const updatedTile = {...tile, ...params}
    return { ...tiles, [params.id]: updatedTile}
  })

  const rotateTile = (tile) => {
    const rotation = (tile.rotation + 90) % 360
    return updateTile({...tile, rotation})
  }

  return {
    tilesById: tiles,
    tilesCollection: Object.values(tiles),
    insertTile,
    deleteTile,
    updateTile,
    rotateTile
  }
}


/**
 * Likewise, I've extracted the zooming behavior into its own hook, which exports
 * the event handler function for the mousewheel in order to zoom in and out
 * on the mouse's current position
 * Here's a great article to better understand SVG scaling and the viewbox:
 * https://css-tricks.com/scale-svg/
 * PRO TIP: You don't need to worry about this for this exercise */
const useZoomableSvg = () => {

  const containerEl = useRef(null)
  const svgEl = useRef(null)
  const [viewBox, setViewBox] = useState([0, 0, 800, 400 ])

  const zoomHandler = (e) => {
    const [ pointerX, pointerY ] = pageCoordsToSvgCoords([e.clientX, e.clientY], svgEl.current)
    const factor = (e.deltaY > 0)
                 ? 1 + (0.001 * e.deltaY)
                 : 1 - (0.001 * Math.abs(e.deltaY))

    requestAnimationFrame(() => setViewBox(([x, y, w, h]) => {
      const weightX = (pointerX - x) / w
      const weightY = (pointerY - y) / h

      const newW = w * factor
      const newH = h * factor

      const newX = x - ((newW - w) * weightX)
      const newY = y - ((newH - h) * weightY)

      return [ newX, newY, newW, newH ]
    }))
  }

  useEffect(() => {
    const updateViewBoxAspect = () => {
      const aspect = containerEl.current
                   ? containerEl.current.clientWidth / containerEl.current.clientHeight
                   : 2 / 1
      setViewBox(([ x, y, w, h]) => ([x, y, w, w/aspect]), [])
    }
    updateViewBoxAspect()
    window.addEventListener('resize', updateViewBoxAspect)
    return () => window.removeEventListener('resize', updateViewBoxAspect)
  }, [containerEl])

  return { viewBox, zoomHandler, containerEl, svgEl }
}




const PlaySpace = () => {

  // see notes above for these two custom hooks
  const { viewBox, zoomHandler, containerEl, svgEl } = useZoomableSvg()
  const { tilesCollection, insertTile, rotateTile, deleteTile } = useTiles()

  // Moving the cursor around the playspace constantly converts the current
  // coordinates within the browser window into the appropriate coordinates
  // within the SVG, saving the [x,y] position of the current tile square
  // to state.
  const [ tilePosition, setTilePosition ] = useState([0, 0])
  const handleMouseMove = (evt) => {
    const [x, y] = pageCoordsToSvgCoords([evt.clientX, evt.clientY], svgEl.current)
    setTilePosition([
      Math.floor(x / TILE_WIDTH),
      Math.floor(y / TILE_HEIGHT)
    ])
  }

  // The PlaySpace component itself is an SVG graphic. Zooming in and out
  // changes the viewBox attribute, which determines which part of the graphic
  // is shown. The `viewBox` variable is returned from the custom
  // `useZoomableSvg` hook defined above.
  return (
    <div className="playspace" ref={containerEl}>
      <svg ref={svgEl}
           viewBox={viewBox.join(' ')}
           style={{backgroundColor: COLOR_GRASS}}
           xmlns="http://www.w3.org/2000/svg"
           onMouseMove={handleMouseMove}
           onWheel={zoomHandler}
      >

        <HoverIndicator tilePosition={tilePosition} insertTile={insertTile} />

        {tilesCollection.map((tile) => (
          <TrackTile key={tile.position}
            tile={tile}
            deleteTile={deleteTile}
            rotateTile={rotateTile}
          />
        ))}

      </svg>
    </div>

  )
}

export default PlaySpace
