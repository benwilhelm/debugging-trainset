import React from 'react'
import Engine from './Engine'
import Car from './Car'
import { range } from 'lodash'
import './index.css'

import { getDestinationTile } from '../../../store/playspace'

export default ({ train, tiles, zoomFactor }) => {
  const tile = tiles[train.tilePosition.toString()]
  const { point, rotation } = tile.travelFunction(train.step, train.entryPoint)

  const carLocations = (range(train.cars)).map(i => {
    const car = getDestinationTile({...train, speed: -10}, -50 * (i+1), tiles)
    const carTile = tiles[car.tilePosition.toString()]
    return carTile.travelFunction(car.step, car.entryPoint)
  })


  return <>
    {carLocations.map(car => <Car key={`car-1-${train.id}`} train={train} coordinates={car.point} rotation={car.rotation} />)}
    <Engine key={`engine-${train.id}`} train={train} coordinates={point} rotation={rotation} zoomFactor={zoomFactor} />
  </>
}
