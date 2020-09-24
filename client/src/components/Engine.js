import React from 'react'
import './Engine.css'

export default ({coordinates}) => {
  const [ x, y ] = coordinates

  return <svg className='engine'>
    <circle cx={x} cy={y} r={10} />
  </svg>
}
