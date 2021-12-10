import React from 'react'
import PropTypes from 'prop-types'
import { Text, TextIcon } from '../Text'
import { Loading } from '../Loading'
import { Link } from '../Link'
import { useFormRef } from '../../hooks'

import './button.scss'

import {
  sizes, themes,
} from '../../constants/button'

const ButtonText = ({ children }) => (<span className="level-button-text">{ children }</span>)

ButtonText.propTypes = {
  children: PropTypes.node.isRequired,
}

const Button = (props) => {
  const {
    type,
    disabled,
    icon,
    iconAfter,
    isLoading,
    label,
    onClick,
    text,
    children = text,
    size,
    theme,
    className: propsClassName,
    as,
    ...rest
  } = props

  const className = `level-button ${propsClassName || ''}`
  const Component = (rest.to || rest.href) ? Link : as

  return (
    <Component
      className={className}
      aria-label={label}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
      data-theme={theme}
      data-size={size}
      {...rest}
    >
      { icon && !children ? (
        <TextIcon icon={icon} />
      ) : (
        <Text icon={icon} iconAfter={iconAfter} grow={theme === 'wrapper'}>
          <ButtonText>{ isLoading ? <Loading text={children} /> : children }</ButtonText>
        </Text>
      )}
    </Component>
  )
}

Button.propTypes = {
  label: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.array]),
  text: ({ text, children, label }) => ((!text && !children && !label) ? (new Error('Button requires either text, children, or a label prop.')) : null),
  type: PropTypes.string,
  icon: Text.propTypes.icon,
  iconAfter: Text.propTypes.iconAfter,
  isLoading: PropTypes.bool,
  theme: PropTypes.oneOf(themes),
  size: PropTypes.oneOf(sizes),
  as: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.string]),
}

Button.defaultProps = {
  type: 'button',
  isLoading: false,
  theme: 'default',
  size: 4,
  label: undefined,
  children: undefined,
  text: undefined,
  icon: undefined,
  iconAfter: undefined,
  as: 'button',
}

const SubmitButton = ({
  text, children = text, beforeSubmit, ...rest
}) => {
  const formRef = useFormRef()
  const { isSubmitting, errors } = formRef.formState

  const onClick = React.useCallback(async (event) => {
    if (beforeSubmit) {
      try {
        event.preventDefault()
        await beforeSubmit({ formRef })
        if (rest.onClick) rest.onClick(event)
        formRef.submit()
      } catch (er) {
        throw new Error('Failed to upload file')
      }
    }
    if (rest.onClick) rest.onClick(event)
  }, [beforeSubmit])

  return (
    <Button
      {...rest}
      text={children}
      isLoading={isSubmitting || rest.isLoading}
      disabled={rest.disabled || !!Object.keys(errors).length}
      onClick={onClick}
    />
  )
}

SubmitButton.propTypes = {
  ...Button.propTypes,
}

SubmitButton.defaultProps = {
  ...Button.defaultProps,
  theme: 'primary',
  text: 'Submit',
  type: 'submit',
}

export { Button, SubmitButton }
