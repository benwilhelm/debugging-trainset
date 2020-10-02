import React, { useEffect } from 'react'
import Engine from './Engine'
import Car from './Car'
import { range } from 'lodash'
import './index.css'

import { getDestinationTile } from '../../../store/playspace/selectors'

export default ({ train, tiles, zoomFactor, stopTrain }) => {
  const tile = tiles[train.tilePosition.toString()]
  const { point, rotation } = tile.travelFunction(train.step, train.tileDirection)

  const carLocations = (range(train.cars)).map(i => {
    const car = getDestinationTile(train, -50 * (i+1), tiles)
    const carTile = tiles[car.tilePosition.toString()]
    return carTile.travelFunction(car.step, car.tileDirection)
  })

  const stopped = carLocations.map(loc => loc.speed).includes(0)

  useEffect(() => {
    if (stopped) {
      stopTrain({id: train.id})
    }
  }, [ stopped, stopTrain, train.id ])

  return <>
    {carLocations.map((car, i) => <Car key={`car-${i}-${train.id}`} train={train} coordinates={car.point} rotation={car.rotation} />)}
    <Engine key={`engine-${train.id}`} train={train} coordinates={point} rotation={rotation} zoomFactor={zoomFactor} />
  </>
}
