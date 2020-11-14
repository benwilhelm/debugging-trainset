import React from 'react'
import Locator from './../Locator'
import { TRACK_WIDTH } from '../../../constants'

const ENGINE_LENGTH = TRACK_WIDTH * 3
const ENGINE_WIDTH = TRACK_WIDTH + 10

const Engine = ({ train, coordinates, rotation, highlight, zoomFactor }) => {
  const [ x, y ] = coordinates

  return <svg className='engine' x={x} y={y}>
    <g transform={`rotate(${rotation} 0 0)`}>

      <circle cx={0} cy={ENGINE_LENGTH/2} r={3} fill={"#FF8"} />

      <rect
       x={-(ENGINE_WIDTH-6)/2} width={ENGINE_WIDTH - 6}
       y={-ENGINE_LENGTH/2} height={ENGINE_LENGTH}
       fill={train.colors.main}
      />

      <circle cx={0} cy={ENGINE_LENGTH/2 - 10} r={5} fill={train.colors.dark} />
      <circle cx={0} cy={ENGINE_LENGTH/2 - 10} r={3} fill="#000" />


      <rect
       x={-ENGINE_WIDTH/2} width={ENGINE_WIDTH}
       y={-ENGINE_LENGTH/2} height={ENGINE_LENGTH / 2.5}
       fill={train.colors.dark}
      />
    </g>

    { (train.highlight || zoomFactor < 0.2) && (
      <Locator coordinates={[0, -ENGINE_LENGTH/2]} color={train.colors.main} zoomFactor={zoomFactor} />
    )}
  </svg>
}

export default Engine
