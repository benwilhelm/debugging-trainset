import React from 'react'

const Locator = ({coordinates, zoomFactor, color='white'}) => {
  const [ x, y ] = coordinates
  return (
    <g transform={`scale(${1/zoomFactor}) translate(${x * zoomFactor} ${y * zoomFactor})`}>
      <polygon points="0,0 -15,-15 15,-15" style={{
        fill: color,
        stroke: 'white',
        strokeWidth: 4
      }} />
    </g>
  )
}

export default Locator
