import PropTypes from 'prop-types'
import { themes, tagSizes } from '../constants/themes'
import { toColor } from './color'
import { spaceToSize } from './space'

const toTheme = (props = {}, allThemes = themes) => {
  const options = {
    ...themes.default, ...allThemes[props.theme], ...props,
  }
  return {
    ...options,
    color: toColor(options.color),
    space: spaceToSize(options.space),
    fontSize: spaceToSize(options.fontSize),
  }
}

toTheme.propTypes = {
  ...toColor.propTypes,
}

const toTextStyle = (props = {}) => {
  const options = toTheme({
    ...props,
    fontSize: (typeof props.fontSize !== 'undefined') ? props.fontSize : tagSizes[props.tag],
  })

  options.style = { fontSize: options.fontSize, color: options.color }

  return options
}

toTextStyle.propTypes = {
  theme: PropTypes.string,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  ...toTheme.propTypes,
}

toTextStyle.defaultProps = { theme: 'default', ...themes.default }

const toFontSize = spaceToSize

export {
  toTheme,
  toTextStyle,
  toFontSize,
}
