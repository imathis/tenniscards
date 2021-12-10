import React from 'react'
import PropTypes from 'prop-types'
import { Stack } from '../Stack'
import { Shelf } from '../Shelf'
import { Icon } from '../Icon'
import { useFormRef, useUuid } from '../../hooks'
import { camelToTitle, formValueEquivalent } from '../../helpers'

// 'specSectionCode' => 'Spec Section Code'
const deriveLabel = ({ label, name }) => (label === true ? camelToTitle(name) : label)

const Input = ({
  name,
  placeholder,
  messages,
  required: Required,
  pattern: Pattern,
  className,
  validate,
  label,
  submitOnBlur,
  submitOnChange,
  size,
  type,
  id,
  onBlur: onBlurProp,
  onChange: onChangeProp,
  tag: Tag,
  afterText,
  theme,
  autoComplete,
  errorMessage,
  valueAsNumber,
  valueAsDate,
  setValueAs,
  ...rest
}) => {
  const uuid = useUuid()
  const labelText = deriveLabel({ label, name })
  const required = Required ? (messages.required || `${labelText} is required`) : null
  const pattern = Pattern ? {
    value: Pattern,
    message: messages.pattern || `${labelText} is not valid`,
  } : null
  const formRef = useFormRef()
  const inputId = id || `input-${uuid}`

  // Allow input changes to submit form
  const onChange = submitOnChange && formRef ? (event) => {
    if (!formValueEquivalent(event.target.value, rest.defaultValue)) formRef.submit()
    if (onChangeProp) onChangeProp(event)
  } : onChangeProp

  // Allow blur to submit form if input value has changed
  const onBlur = submitOnBlur && formRef ? (event) => {
    if (!formValueEquivalent(event.target.value, rest.defaultValue)) {
      formRef.submit()
      if (onChangeProp) onChangeProp(event)
    }
    if (onBlurProp) onBlurProp(event)
  } : onBlurProp

  const error = React.useMemo(() => (
    formRef?.errors[name]?.message || errorMessage
  ), [formRef?.errors[name], errorMessage])

  const isInline = ['radio', 'checkbox'].includes(type)

  const inputTag = (
    <Tag
      id={inputId}
      type={type}
      name={name}
      data-size={size}
      placeholder={placeholder || !label ? (placeholder || labelText || '') : ''}
      onBlur={onBlur}
      onChange={onChange}
      className={`level-input ${className || ''} ${formRef?.errors[name] ? 'level-input-error' : ''}`}
      data-theme={theme}
      autoComplete={autoComplete === false ? 'none' : autoComplete}
      ref={formRef ? formRef.register({
        required,
        pattern,
        validate,
      }) : null}
      {...rest}
    />
  )

  if (isInline) {
    return (
      <Stack space={4}>
        <div className="level-input-wrapper" data-input-type={type}>
          { inputTag }
          <label className="level-label" htmlFor={inputId}>
            <div className="level-input-marker">
              { type === 'checkbox' ? <Icon name="check" color="neutral-600" /> : null}
            </div>
            {labelText}
          </label>
        </div>
        { error ? <div className="level-input-error-message">{error}</div> : null }
      </Stack>
    )
  }

  return (
    <Stack space={4}>
      { label ? <label className="level-label" htmlFor={inputId}>{labelText}</label> : null }
      { afterText === null ? inputTag : (
        <Shelf space={4} valign="center">
          { inputTag }
          { afterText }
        </Shelf>
      )}
      { error ? <div className="level-input-error-message">{error}</div> : null }
    </Stack>
  )
}

Input.propTypes = {
  tag: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  pattern: PropTypes.object,
  validate: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  className: PropTypes.string,
  messages: PropTypes.shape({
    pattern: PropTypes.string,
    min: PropTypes.string,
    max: PropTypes.string,
    required: PropTypes.string,
  }),
  size: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  submitOnChange: PropTypes.bool,
  submitOnBlur: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  afterText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  theme: PropTypes.string,
  autoComplete: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  errorMessage: PropTypes.string,
  valueAsNumber: PropTypes.bool,
  valueAsDate: PropTypes.bool,
  setValueAs: PropTypes.func,
}

Input.defaultProps = {
  tag: 'input',
  type: 'text',
  id: null,
  size: 4,
  label: true,
  messages: {},
  onBlur: null,
  onChange: null,
  validate: null,
  required: false,
  placeholder: null,
  pattern: null,
  className: null,
  submitOnChange: false,
  submitOnBlur: false,
  afterText: null,
  theme: null,
  autoComplete: null,
  errorMessage: null,
  valueAsNumber: null,
  valueAsDate: null,
  setValueAs: null,
}

const Textarea = (props) => <Input tag="textarea" rows={6} {...props} />
const RadioInput = (props) => <Input type="radio" {...props} />
const CheckboxInput = (props) => <Input type="checkbox" {...props} />

export {
  deriveLabel,
  Input,
  Textarea,
  RadioInput,
  CheckboxInput,
}
