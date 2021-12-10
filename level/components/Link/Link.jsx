import React from 'react'
import PropTypes from 'prop-types'
import { NavLink as RouterNavLink } from 'react-router-dom'

import { Text } from '../Text'
import { Loading } from '../Loading'

import './link.scss'

import { excludeKeys, toColor } from '../../helpers'

const LinkTag = (link) => {
  if (link?.href) return 'a'
  if (link?.to) return RouterNavLink
  return 'div'
}

const targetUrl = (to, href) => {
  if (href) return ({ href })
  if (!to) return null

  const url = (to.pathname || to)

  // If an outbound url, return an href prop instead of a to
  if (url.startsWith('http')) { return { href: url } }

  // Replace accidental double forward slashes caused by foolish router interactions
  const pathname = url.replace(/\/+/g, '/')
  // Merge with other to props, or return as a prop
  return { to: typeof to === 'object' ? { ...to, pathname } : pathname }
}

const Link = React.forwardRef(({
  href,
  to,
  icon,
  iconAfter,
  role,
  onClick,
  className,
  isLoading,
  text,
  color,
  style,
  children = text,
  ...rest
}, ref) => {
  const url = targetUrl(to, href)
  const Tag = href ? 'a' : LinkTag(url)
  const clickEvent = onClick ? ((e) => { e.preventDefault(); onClick(e) }) : null
  const linkItemText = children
  const htmlRole = (Tag === 'div' ? role || 'button' : role)
  // for non Router links remove activeClassName since it's not a valid DOM property
  const props = Tag === RouterNavLink ? rest : excludeKeys(rest, 'activeClassName')

  return (
    <Tag
      className={className}
      {...url}
      role={htmlRole}
      tabIndex={role === 'button' ? 0 : null}
      onClick={clickEvent}
      style={{ color: toColor(color), ...style }}
      ref={ref}
      {...props}
    >
      <Text
        icon={icon}
        iconAfter={iconAfter}
      >{ isLoading ? <Loading text={linkItemText} /> : linkItemText }
      </Text>
    </Tag>
  )
})

Link.propTypes = {
  /* eslint-disable react/require-default-props */
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.array]),
  text: ({ text, children }) => (
    (!text && !children) ? (new Error('Link requires either text or a children prop.')) : null
  ),
  href: PropTypes.string,
  role: PropTypes.oneOf(['link', 'button', 'menuitem']),
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
    pathname: PropTypes.string,
    path: PropTypes.string,
    search: PropTypes.string,
    hash: PropTypes.string,
    state: PropTypes.object,
  })]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  icon: Text.propTypes.icon,
  iconAfter: Text.propTypes.iconAfter,
  isLoading: PropTypes.bool,
  style: PropTypes.object,
  color: toColor.propTypes.color,
}

Link.defaultProps = {
  role: 'link',
  className: 'level-link',
  icon: null,
  iconAfter: null,
  isLoading: false,
  color: null,
  style: {},
}

export { Link }
