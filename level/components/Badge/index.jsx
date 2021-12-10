import React from 'react'
import PropTypes from 'prop-types'
import { Color, toColor, stringId } from '../../helpers'
import { useUuid } from '../../hooks'

import { Icon } from '../Icon'
import { badgeSizes } from '../../constants/badgeSizes'

const stringToColor = (str) => {
  const num = stringId(str)
  return Color({ hue: num % 361, sat: 80, lum: (num % 5) + 35 })
}

const useGradient = ({ fill, pickGradient }) => {
  const [gradient, setGradient] = React.useState({})
  const uuid = useUuid()

  React.useEffect(() => {
    if (pickGradient) {
      const bg = fill ? Color(toColor(fill) || fill) : stringToColor(pickGradient)
      setGradient({
        gradientDefs: (
          <defs>
            <linearGradient id={`gradient-fill-${uuid}`} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor={bg.lighten(8)} />
              <stop offset=".5" stopColor={bg} />
              <stop offset="1" stopColor={bg.darken(8)} />
            </linearGradient>
          </defs>
        ),
        gradientFill: `url(#gradient-fill-${uuid})`,
      })
    }
  }, [fill, pickGradient])

  return gradient
}

const getSize = ({
  size,
  width = size,
  height = width,
}) => {
  const shapeWidth = badgeSizes[width] || width
  const shapeHeight = badgeSizes[height] || height
  return ({
    width: shapeWidth,
    height: shapeHeight,
  })
}

const Badge = ({
  fill,
  pickGradient,
  pickFill,
  shape,
  children,
  className,
  style,
  ...rest
}) => {
  const { width, height } = getSize(rest)
  const { gradientDefs, gradientFill } = useGradient({ fill, pickGradient })
  const shapeFill = pickFill ? stringToColor(pickFill) : null
  const a = 0.5 * width // 100
  const b = 0.05 * width // 10
  const c = 0.95 * width // 190
  return (
    <svg
      className={`level-badge ${className}`}
      style={{ WebkitUserSelect: 'none', userSelect: 'none', ...style }}
      width={width}
      height={height}
      version="1.1"
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      { gradientDefs }
      { shape === 'rect' ? (
        <rect
          fill={shapeFill || gradientFill || toColor(fill) || fill}
          width={width}
          height={height}
          ry="4"
        />
      ) : null }
      { shape === 'circle' ? (
        <circle
          cx={width / 2}
          cy={height / 2}
          fill={shapeFill || gradientFill || toColor(fill) || fill}
          r={width / 2}
        />
      ) : null }
      { shape === 'squircle' ? (
        <path
          d={`
             M 0, ${a}
             C 0, ${b} ${b}, 0 ${a}, 0
             S ${width}, ${b} ${width}, ${a} ${c}, ${width} ${a}, ${width} 0, ${c} 0, ${a}
           `}
          fill={shapeFill || gradientFill || toColor(fill) || fill}
        />
      ) : null }
      { children }
    </svg>
  )
}

Badge.propTypes = {
  shape: PropTypes.oneOf(['squircle', 'circle', 'rect']),
  size: Icon.propTypes.size,
  className: PropTypes.string,
  pickGradient: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  pickFill: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  fill: toColor.propTypes.color,
  children: PropTypes.node,
  style: PropTypes.object,
}

Badge.defaultProps = {
  shape: 'circle',
  size: null,
  className: null,
  fill: null,
  pickGradient: null,
  pickFill: null,
  children: null,
  style: {},
}

const IconBadge = ({
  name,
  color,
  ...props
}) => {
  const { height, width } = getSize(props)
  return (
    <Badge {...props}>
      <Icon
        name={name}
        color={color}
        width={width * 0.57}
        height={height * 0.57}
        x={(width * 0.43) / 2}
        y={(height * 0.43) / 2}
      />
    </Badge>
  )
}
IconBadge.propTypes = {
  name: Icon.propTypes.name,
  color: Icon.propTypes.color,
}

IconBadge.defaultProps = {
  name: null,
  color: 'white',
}

const TextBadge = ({
  text,
  ...props
}) => {
  const { height, width } = getSize(props)
  return (
    <Badge {...props}>
      <text
        alignmentBaseline="central"
        dominantBaseline="central"
        fill="#FFFFFF"
        fontSize={`${(height / 2) * 0.9}px`}
        fontWeight="400"
        textAnchor="middle"
        x={width / 2}
        y={height / 2}
      >{ text }
      </text>
    </Badge>
  )
}

TextBadge.propTypes = {
  text: PropTypes.string.isRequired,
  ...Badge.propTypes,
}

export {
  TextBadge,
  IconBadge,
}
