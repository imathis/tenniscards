import React from 'react'
import PropTypes from 'prop-types'
import { useWatch } from 'react-hook-form'
import {
  useFormRef, FormProvider, useKeyDown,
} from '../../hooks'

const focusInput = (form, focus) => {
  if (!focus) return null
  const firstInput = 'input:not([type=hidden]), select, textarea'
  const inputs = form.querySelectorAll(firstInput)

  if (focus === 'first') return inputs[0]
  if (focus === 'firstEmpty') {
    return Array.prototype.find.call(inputs, (i) => !i.value) || inputs[0]
  }
  if (focus && focus.startsWith('#')) {
    return form.querySelector(focus)
  }

  return focus ? form.querySelector(`[name=${focus}]`) : null
}

// This creates a useForm hook object and provides it as a context object to its children.
const FormTag = ({
  onSubmit,
  defaultValues,
  hiddenValues,
  reset,
  focus,
  watch,
  onChange,
  onError,
  resetWith,
  children,
  autoComplete,
  ...rest
}) => {
  const formRef = useFormRef()
  const { ref } = formRef
  const { control } = formRef
  const watchedFields = onChange ? useWatch({
    name: watch,
    control,
  }) : null
  const shiftEnter = useKeyDown({ key: ['cmd Enter', 'ctrl Enter'], match: 'textarea' })
  const [formReset, setFormReset] = React.useState()

  React.useEffect(() => {
    if (reset) {
      formRef.reset({ ...defaultValues, ...resetWith })
      // Trigger refocus
      setFormReset({})
    }
  }, [reset])

  React.useEffect(() => {
    if (onChange) onChange(watchedFields)
  }, [watchedFields])

  // Inititally and after a Form reset, trigger a focus based on parameters
  React.useEffect(() => {
    const input = focusInput(ref.current, focus)?.focus()
    if (input) input.focus()
  }, [formReset])

  // Submit form when `cmd/ctrl + enter` invoked on textarea
  React.useEffect(() => {
    if (shiftEnter) formRef.submit()
  }, [shiftEnter])

  React.useEffect(() => {
    if (Object.keys(formRef.errors).length && onError) onError(formRef.errors)
  }, [formRef.errors])

  return (
    <form
      data-focus={focus}
      onSubmit={formRef.submit}
      autoComplete={!autoComplete === false ? 'none' : null}
      {...rest}
      ref={ref}
    >
      { Object.keys(hiddenValues).map((name) => (
        <input
          type="hidden"
          name={name}
          key={name}
          defaultValue={hiddenValues[name]}
          ref={formRef.register}
        />
      ))}
      {children}
    </form>
  )
}

FormTag.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  defaultValues: PropTypes.object,
  hiddenValues: PropTypes.object,
  reset: PropTypes.any,
  resetWith: PropTypes.object,
  focus: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  watch: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  onError: PropTypes.func,
  children: PropTypes.node.isRequired,
  autoComplete: PropTypes.bool,
}

FormTag.defaultProps = {
  onSubmit: null,
  onChange: null,
  defaultValues: {},
  hiddenValues: {},
  reset: null,
  resetWith: {},
  focus: 'first',
  watch: null,
  onError: null,
  autoComplete: false,
}

const Form = (props) => {
  const {
    onSubmit,
    defaultValues,
    errors,
  } = props

  return (
    <FormProvider {...{ defaultValues, errors, onSubmit }}>
      <FormTag {...props} />
    </FormProvider>
  )
}

Form.propTypes = {
  onSubmit: PropTypes.func,
  defaultValues: PropTypes.object,
  errors: PropTypes.array,
  autoComplete: PropTypes.bool,
}

Form.defaultProps = {
  onSubmit: null,
  defaultValues: {},
  errors: [],
  autoComplete: false,
}

export {
  Form,
}
