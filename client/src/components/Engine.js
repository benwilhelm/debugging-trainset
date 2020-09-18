import React, { useState } from 'react'

export default ({position}) => {
  const [ x, y ] = position

  return <svg>
    <circle cx={x} cy={y} r={10} />
  </svg>
}
