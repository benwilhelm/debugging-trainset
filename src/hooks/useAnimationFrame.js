// Thank you to Hunor Márton Borbély at CSS-Tricks for this example
// https://css-tricks.com/using-requestanimationframe-with-react-hooks/

import { useRef, useEffect } from 'react'

export default (callback) => {
  const requestRef = useRef()
  const previousTimeRef = useRef()

  useEffect(() => {
    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current

        const adjustedDeltaTime = deltaTime > 200 ? 16 : deltaTime

        callback(adjustedDeltaTime)
      }

      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [callback])
}
