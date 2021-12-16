import React from 'react'
import PropTypes from 'prop-types'
import { SvgIcon } from '@level'

import * as cards from '@app/assets/icons'

const CardBase = ({
  width = '224',
  height = '312',
  fill = '#fff',
  children,
  className,
  ...rest
}) => (
  <svg
    style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    version="1.1"
    viewBox={`0 0 ${width} ${height}`}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    className={`card-base ${className || ''}`}
    {...rest}
  >
    <rect
      fill={fill}
      width={width}
      height={height}
    />
    { children }
  </svg>
)

const CardSvg = ({ name, ...props }) => {
  const svg = cards[`card${name}`]
  return (
    <CardBase data-name={name} {...props}>
      <SvgIcon
        className="card-face"
        fill="#000"
        svg={svg}
      />
    </CardBase>
  )
}

CardSvg.propTypes = {
  name: PropTypes.oneOf(Object.keys(cards).map((n) => n.replace(/card/, ''))).isRequired,
  className: PropTypes.string,
}

CardSvg.defaultProps = {
  className: 'card-svg',
}

export {
  CardBase,
  CardSvg,
}
