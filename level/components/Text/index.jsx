import React from 'react'
import PropTypes from 'prop-types'
import { toTextStyle } from '../../helpers'
import { Icon } from '../Icon'
import { Shelf, Spacer } from '../Shelf'
import { Column } from '../Column'

import './text.scss'

// This allows icon to be a string for an icon name,
// or an object to pass through to the icon component.
const getIconProps = (icon) => {
  if (!icon) return null
  return (typeof icon === 'string') ? { name: icon } : icon
}

const TextIcon = ({ icon }) => (
  <Icon style={{ marginTop: '0.1em', marginBottom: '-0.1em' }} {...getIconProps(icon)} />
)

const truncatedStyle = ({
  style, truncate, truncateWidth, truncateLines,
}) => {
  if (truncateLines) {
    return {
      ...style,
      display: '-webkit-box',
      WebkitLineClamp: truncateLines,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }
  }
  if (truncate || truncateWidth) {
    return {
      maxWidth: truncateWidth,
      display: 'block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      ...style,
    }
  }

  return style
}

const Text = React.forwardRef(({
  children,
  icon,
  iconAfter,
  className,
  size,
  align,
  valign,
  theme,
  color,
  tag,
  as,
  style,
  grow,
  forceWrap,
  truncate,
  truncateWidth,
  truncateLines,
  noWrap,
  ...rest
}, ref) => {
  const themeProps = toTextStyle({
    fontSize: size,
    theme,
    color,
    tag,
  })

  const componentRef = ref || React.useRef()
  const Component = as || tag
  const hasIcons = icon || iconAfter

  let componentStyle = {
    ...themeProps.style,
    ...truncatedStyle({
      style,
      truncate,
      truncateLines,
      truncateWidth,
    }),
  }

  if (forceWrap === true) componentStyle = { wordBreak: 'break-word', ...componentStyle }
  if (noWrap === true) componentStyle = { whiteSpace: 'nowrap', ...componentStyle }
  if (!hasIcons && align) componentStyle = { textAlign: align, ...componentStyle }

  return (
    <Component style={componentStyle} {...rest} data-theme={theme} className={`level-text ${className || ''}`} ref={componentRef}>
      { !hasIcons ? children : (
        <Shelf wrap={false} align={align} valign={valign}>
          { icon ? <TextIcon icon={icon} /> : null }
          { icon ? <Spacer {...getIconProps(icon)} space={icon?.space || 3} /> : null }
          <Column grow={grow}>{ children }</Column>
          { iconAfter ? <Spacer grow /> : null }
          { iconAfter ? (
            <Spacer
              {...getIconProps(iconAfter)}
              space={iconAfter?.space || 6}
            />
          ) : null }
          { iconAfter ? <TextIcon icon={iconAfter} /> : null }
        </Shelf>
      )}
    </Component>
  )
})

const iconProps = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    ...Icon.propTypes,
    space: Shelf.propTypes.space,
    grow: PropTypes.bool,
  }),
])

TextIcon.propTypes = {
  icon: iconProps.isRequired,
}

Text.propTypes = {
  icon: iconProps,
  iconAfter: iconProps,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  valign: PropTypes.oneOf(['top', 'center', 'bottom', undefined]),
  align: PropTypes.oneOf(['left', 'center', 'right', undefined]),
  as: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.string]),
  noWrap: PropTypes.bool,
  forceWrap: PropTypes.bool,
  truncate: PropTypes.bool,
  truncateLines: PropTypes.number,
  truncateWidth: PropTypes.string,
  theme: PropTypes.string,
  grow: PropTypes.bool,
  ...toTextStyle.propTypes,
}

Text.defaultProps = {
  icon: null,
  iconAfter: null,
  className: '',
  as: null,
  align: null,
  valign: 'center',
  noWrap: null,
  grow: null,
  truncate: null,
  truncateLines: null,
  truncateWidth: null,
  forceWrap: null,
  theme: null,
  ...toTextStyle.defaultProps,
}

const P = ({ style, ...rest }) => (
  <Text tag="p" style={{ whiteSpace: 'pre-wrap', ...style }} {...rest} />
)

P.propTypes = {
  style: PropTypes.object,
  forceWrap: PropTypes.bool,
}

P.defaultProps = {
  style: {},
  forceWrap: true,
}

const SectionLabel = (props) => <Text {...props} className="level-section-label" size={0} color="neutral-400" />

export {
  Text,
  TextIcon,
  SectionLabel,
  P,
}
