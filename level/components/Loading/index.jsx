import React from 'react'
import PropTypes from 'prop-types'
import { toColor, toFontSize } from '../../helpers'
import { ProgressBar } from './ProgressBar'

import './loading.scss'

const LoadingDotsSvg = () => (
  <svg className="level-loading-dots" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 17">
    <circle cx="2.2" cy="15.4" r="1.6" />
    <circle cx="9.5" cy="15.4" r="1.6" />
    <circle cx="16.8" cy="15.4" r="1.6" />
  </svg>
)

const LoadingDots = ({ text }) => (
  !text ? <LoadingDotsSvg /> : (
    <React.Fragment>
      <div className="level-loading-text">{text}</div>
      <LoadingDotsSvg />
    </React.Fragment>
  )
)

// Support for future loading types
const types = {
  dots: LoadingDots,
}

const Loading = ({
  text, color, size, type,
}) => {
  const Loader = types[type]
  return (
    <span className="level-loading" data-type={type} style={{ color: toColor(color), fontSize: toFontSize(size) }}>
      <Loader text={text} />
    </span>
  )
}

Loading.propTypes = {
  type: PropTypes.oneOf(Object.keys(types)),
  size: toFontSize.propTypes.fontSize,
  color: toColor.propTypes.color,
  text: PropTypes.string,
}

Loading.defaultProps = {
  type: 'dots',
  color: 'inherit',
  size: 'inherit',
  text: null,
}

LoadingDots.propTypes = {
  text: Loading.propTypes.text,
}

LoadingDots.defaultProps = {
  text: Loading.defaultProps.text,
}

export { Loading, ProgressBar }
