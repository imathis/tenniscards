import React from 'react'
import PropTypes from 'prop-types'

import {
  dasherize,
  camelize,
  jsxToString,
  toColor,
} from '../../helpers'

import { sizes } from '../../constants/fontSize'
import * as icons from '../../assets/icons'

const iconNames = Object.keys(icons).map(dasherize)

const SvgIcon = ({
  color,
  fill,
  size,
  className,
  width: widthProp,
  height: heightProp,
  svg: Svg,
  ...rest
}) => {
  const width = widthProp || heightProp || size
  const height = heightProp || width || size

  return (
    <Svg
      className={`level-icon${className ? ` ${className}` : ''}`}
      fill={fill || toColor(color) || 'currentColor'}
      width={sizes[width] || width}
      height={sizes[height] || height}
      {...rest}
    />
  )
}

const Icon = ({
  name,
  ...rest
}) => {
  const svg = icons[camelize(name)]

  return (
    <SvgIcon
      svg={svg}
      data-name={name}
      {...rest}
    />
  )
}

Icon.propTypes = {
  name: PropTypes.oneOf(iconNames).isRequired,
}

SvgIcon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fill: PropTypes.string,
  className: PropTypes.string,
  svg: PropTypes.any.isRequired,
  ...toColor.propTypes,
}

SvgIcon.defaultProps = {
  className: null,
  size: null,
  fill: null,
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
  SvgIcon,
  useStringIcon,
}
