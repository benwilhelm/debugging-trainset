/**
 * Moving the cursor around the playspace constantly converts the current
 * coordinates within the browser window into the appropriate coordinates
 * within the SVG, saving the [x,y] position of the current tile square
 * to state.*/

import { useState } from 'react'
import  { pageCoordsToSvgCoords } from '../../util'
import { TILE_WIDTH, TILE_HEIGHT } from '../../constants'
import { isEqual } from 'lodash'

const useTilePosition = (svgEl) => {
  const [ tilePosition, setTilePosition ] = useState([0, 0])
  const handleMouseMove = (evt) => {
    const [x, y] = pageCoordsToSvgCoords([evt.clientX, evt.clientY], svgEl.current)
    const currentTilePosition = [
      Math.floor(x / TILE_WIDTH),
      Math.floor(y / TILE_HEIGHT)
    ]

    // by setting to the lastTilePosition if the value is unchanged,
    // we don't trigger unnecessary re-renders on ever mousemove event.
    setTilePosition(lastTilePosition => isEqual(lastTilePosition, currentTilePosition)
                                      ? lastTilePosition
                                      : currentTilePosition)
  }

  return { handleMouseMove, tilePosition }
}

export default useTilePosition
