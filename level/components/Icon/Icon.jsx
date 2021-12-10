import React from 'react'
import PropTypes from 'prop-types'

import {
  dasherize,
  camelize,
  jsxToString,
  toColor,
} from '../../helpers'

import { sizes } from '../../constants/fontSize'
import * as icons from '../../icons'

const iconNames = Object.keys(icons).map(dasherize)

const Icon = ({
  name,
  style,
  color,
  fill,
  size,
  className,
  width: widthProp,
  height: heightProp,
  ...rest
}) => {
  const Svg = icons[camelize(name)]

  const width = widthProp || heightProp || size
  const height = heightProp || width || size

  return (
    <Svg
      className={`level-icon${className ? ` ${className}` : ''}`}
      data-name={name}
      style={style}
      fill={fill || toColor(color) || 'currentColor'}
      width={sizes[width] || width}
      height={sizes[height] || height}
      {...rest}
    />
  )
}

Icon.propTypes = {
  name: PropTypes.oneOf(iconNames).isRequired,
  style: PropTypes.object,
  size: PropTypes.oneOf(Object.keys(sizes).map((n) => parseInt(n, 10) || n)),
  fill: PropTypes.string,
  className: PropTypes.string,
  ...toColor.propTypes,
}

Icon.defaultProps = {
  className: null,
  size: 'default',
  fill: null,
  style: {},
}

// Because SVGr doesn't keep the xmlns but when stringified, it is needed
const addXmlns = (str) => (
  str.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"')
)

const useStringIcon = (props) => React.useMemo(() => (
  addXmlns(jsxToString(<Icon {...props} />))
), [props])

export {
  Icon,
  useStringIcon,
}
