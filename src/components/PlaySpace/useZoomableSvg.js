/**
 * I've extracted the zooming behavior into its own hook, which exports
 * the event handler function for the mousewheel in order to zoom in and out
 * on the mouse's current position
 * Here's a great article to better understand SVG scaling and the viewbox:
 * https://css-tricks.com/scale-svg/
 * PRO TIP: You don't need to worry about this for this exercise */
import { useRef, useState, useEffect } from 'react'
import  { pageCoordsToSvgCoords } from '../../util'

const useZoomableSvg = () => {

  const containerEl = useRef(null)
  const svgEl = useRef(null)
  const [viewBox, setViewBox] = useState([0, 0, 400, 400 ])

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

export default useZoomableSvg
