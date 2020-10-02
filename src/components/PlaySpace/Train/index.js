import React, { useEffect } from 'react'
import Engine from './Engine'
import Car from './Car'
import './index.css'


export default ({ train, zoomFactor, stopTrain }) => {

  const { point, rotation } = train.engineLocation
  const stopped = train.carLocations.map(loc => loc.speed).includes(0)
  useEffect(() => {
    if (stopped) {
      stopTrain({id: train.id})
    }
  }, [ stopped, stopTrain, train.id ])

  return <>
    {train.carLocations.map((car, i) => <Car key={`car-${i}-${train.id}`} train={train} coordinates={car.point} rotation={car.rotation} />)}
    <Engine key={`engine-${train.id}`} train={train} coordinates={point} rotation={rotation} zoomFactor={zoomFactor} />
  </>
}
