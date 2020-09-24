import React from 'react'
import './Engine.css'

export default ({ engine, dispatchEngineTravel }) => {

  const [ x, y ] = engine.coordinates

  return <svg className='engine'>
    <circle cx={x} cy={y} r={10} />
  </svg>
}
