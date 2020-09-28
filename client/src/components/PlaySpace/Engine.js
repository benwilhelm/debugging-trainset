import React from 'react'
import Locator from './Locator'
import './Engine.css'
import { TRACK_WIDTH } from '../../constants'

const ENGINE_LENGTH = TRACK_WIDTH * 3
const ENGINE_WIDTH = TRACK_WIDTH + 10

export default ({ engine, coordinates, rotation, highlight, zoomFactor }) => {
  const [ x, y ] = coordinates

  return <svg className='engine' x={x} y={y}>
    <g transform={`rotate(${rotation} 0 0)`}>

      <circle cx={0} cy={ENGINE_LENGTH/2} r={3} fill={"#FF8"} />

      <rect
       x={-(ENGINE_WIDTH-6)/2} width={ENGINE_WIDTH - 6}
       y={-ENGINE_LENGTH/2} height={ENGINE_LENGTH}
       fill={engine.colors.main}
      />

      <circle cx={0} cy={ENGINE_LENGTH/2 - 10} r={5} fill={engine.colors.dark} />
      <circle cx={0} cy={ENGINE_LENGTH/2 - 10} r={3} fill="#000" />


      <rect
       x={-ENGINE_WIDTH/2} width={ENGINE_WIDTH}
       y={-ENGINE_LENGTH/2} height={ENGINE_LENGTH / 2.5}
       fill={engine.colors.dark}
      />
    </g>

    { (engine.highlight || zoomFactor < 0.5) && (
      <Locator coordinates={[0, -ENGINE_LENGTH/2]} color={engine.colors.main} zoomFactor={zoomFactor} />
    )}
  </svg>
}
