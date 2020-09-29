import React from 'react'
const noop = () => {}

export default ({ train, updateTrain=noop, min=-100, max=100, step=1 }) => {
  const dataListId = `train-speed-input-list-${train.id}`
  return <div className="train-speed">
    <input type="range"
      style={{width: '100%'}}
      onInput={e => updateTrain({...train, speed: e.target.value})}
      onChange={noop}
      min={min}
      max={max}
      step={step}
      value={train.speed}
      list={dataListId}
    />

    <datalist id={dataListId}>
      <option value={min} label={min}></option>
      <option value={0} label="Stop"></option>
      <option value={max} label={max}></option>
    </datalist>

    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <button onClick={() => updateTrain({...train, speed: min})}>Reverse</button>
      <button onClick={() => updateTrain({...train, speed: 0})}>Stop</button>
      <button onClick={() => updateTrain({...train, speed: max})}>Forward</button>
    </div>

  </div>
}
