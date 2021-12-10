import React from 'react'
import PropTypes from 'prop-types'

import { useFormRef } from '../../hooks'

const HiddenInput = ({
  name,
  label,
  required: requiredProp,
  ...rest
}) => {
  const required = requiredProp ? `${label || name.replace(/\W/g, '')} is required` : null
  const formRef = useFormRef()

  return (
    <input
      type="hidden"
      name={name}
      ref={formRef ? formRef.register({ required }) : null}
      {...rest}
    />
  )
}

HiddenInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
}

HiddenInput.defaultProps = {
  label: null,
  required: false,
}

export {
  HiddenInput,
}
