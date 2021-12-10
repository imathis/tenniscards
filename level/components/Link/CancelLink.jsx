import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Link } from './Link'

const CancelLink = ({ to, text, ...rest }) => {
  const { state } = useLocation()
  const history = useNavigate()

  // Get the cancel url from state or props
  const url = state?.cancelTo || to
  const linkText = state?.cancelText || text
  // If no url provided default to back button behavior
  const click = !url ? () => history.goBack() : null

  return (
    <Link
      to={url}
      className="level-link cancel"
      text={linkText}
      onClick={click}
      color="neutral-600"
      {...rest}
    />
  )
}

CancelLink.propTypes = {
  /* eslint-disable react/require-default-props */
  children: Link.propTypes.children,
  to: Link.propTypes.to,
  text: Link.propTypes.text,
}

CancelLink.defaultProps = {
  text: 'Cancel',
  to: null,
}

export { CancelLink }
