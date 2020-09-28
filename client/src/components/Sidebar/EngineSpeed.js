import React from 'react'
const noop = () => {}

export default ({ engine, updateEngine=noop, min=-100, max=100, step=1 }) => {
  const dataListId = `engine-speed-input-list-${engine.id}`
  return <div className="engine-speed">
    <input type="range"
      style={{width: '100%'}}
      onInput={e => updateEngine({...engine, speed: e.target.value})}
      onChange={noop}
      min={min}
      max={max}
      step={step}
      value={engine.speed}
      list={dataListId}
    />

    <datalist id={dataListId}>
      <option value={min} label={min}></option>
      <option value={0} label="Stop"></option>
      <option value={max} label={max}></option>
    </datalist>

    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <button onClick={() => updateEngine({...engine, speed: min})}>Reverse</button>
      <button onClick={() => updateEngine({...engine, speed: 0})}>Stop</button>
      <button onClick={() => updateEngine({...engine, speed: max})}>Forward</button>
    </div>

  </div>
}
