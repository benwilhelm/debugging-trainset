import React from 'react'

export default ({coordinates}) => {
  const [ x, y ] = coordinates

  return <svg>
    <circle cx={x} cy={y} r={10} />
  </svg>
}
