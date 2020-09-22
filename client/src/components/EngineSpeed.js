import React from 'react'
const noop = () => {}

export default ({ value, onUpdate=noop, min=0, max=100, step=1 }) => {
  return <div className="engine-speed">
    <input type="range"
      onInput={e => onUpdate(e.target.value)}
      onChange={noop}
      min={min}
      max={max}
      step={step}
      value={value}
    />
  </div>
}
