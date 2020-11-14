import React from 'react'
import { TRACK_WIDTH } from '../../../constants'

const CAR_LENGTH = TRACK_WIDTH * 3
const CAR_WIDTH = TRACK_WIDTH + 6

const Car = ({ train, coordinates, rotation, }) => {
  const [ x, y ] = coordinates

  return <svg className='car' x={x} y={y}>
    <g transform={`rotate(${rotation} 0 0)`}>

      <rect
       x={-(CAR_WIDTH)/2} width={CAR_WIDTH}
       y={-CAR_LENGTH/2} height={CAR_LENGTH}
       rx={1}
       fill={train.colors.main}
       stroke={train.colors.dark}
       strokeWidth={2}
      />

      <line x1={-(CAR_WIDTH/2)} y1={0} x2={CAR_WIDTH/2} y2={0} stroke={train.colors.dark} strokeWidth={3} />
      <line x1={0} y1={CAR_LENGTH/2} x2={0} y2={-CAR_LENGTH/2} stroke={train.colors.dark} strokeWidth={3} />
    </g>
  </svg>
}

export default Car
