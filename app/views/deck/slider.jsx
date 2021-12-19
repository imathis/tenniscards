import React from 'react'
import './slider.scss'

const SliderInput = (props) => (
  <div className="range-slider">
    <input
      className="range-slider-range"
      type="range"
      min="0"
      {...props}
    />
  </div>
)

export {
  SliderInput,
}
