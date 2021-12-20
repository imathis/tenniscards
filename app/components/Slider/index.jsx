import React from 'react'
import './slider.scss'

const SliderInput = (props) => {
  const [value, setValue] = React.useState(props.value)
  const onChange = React.useCallback((event) => {
    setValue(event.target.value)
    if (props.onChange) props.onchange(event)
  }, [])

  return (
    <div
      className="range-slider"
      data-value={value}
    >
      <input
        className="range-slider-range"
        type="range"
        onChange={onChange}
        {...props}
      />
      <div className="range-slider-track">
        { new Array(props.max).fill(1).map(() => (
          <div className="range-slider-segment" />
        ))}
      </div>
    </div>
  )
}

export {
  SliderInput,
}
