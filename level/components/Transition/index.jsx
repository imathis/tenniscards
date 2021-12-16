import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'

const Transition = ({ inProp, ...rest }) => {
  const [inTrans, setInTrans] = React.useState()

  React.useEffect(() => {
    if (inProp) setInTrans(true)
  }, [inProp])

  return <CSSTransition in={inTrans} {...rest} />
}

Transition.propTypes = {
  inProp: PropTypes.any.isRequired,
}

export {
  Transition,
}
