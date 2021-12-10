import React from 'react'
import { useForm as reactHookForm } from 'react-hook-form'
import { mapToKey } from '../helpers'

const FormContext = React.createContext()

const useFormRef = () => React.useContext(FormContext)

const castValue = (input) => {
  if (input.matches('[type=number], [type=range]')) return Number.parseInt(input.value, 10)
  if (input.type === 'checkbox') return input.checked
  return input.value
}

const castFormData = ({ ref, formData }) => {
  // select inputs which match castable types
  const selectors = Object.keys(formData).map((name) => (
    `[name=${name}][type=number],[name=${name}][type=range],[name=${name}][type=checkbox]`
  )).join(',')

  if (!selectors) return formData

  // Override formData with cast inputs
  const castable = ref.current.querySelectorAll(selectors)
  const newFormData = Array.prototype.reduce.call(castable, (all, input) => (
    { ...all, [input.name]: castValue(input) }
  ), formData)

  return newFormData
}

// Wraps the useForm hook with helpful error checking and default merging
const useForm = ({
  errors,
  defaultValues,
  onSubmit,
  ...rest
}) => {
  const formRef = reactHookForm({ ...rest, defaultValues })
  const ref = React.useRef()
  const [beforeSubmit, setBeforeSubmit] = React.useState({})

  const setErrors = React.useCallback((errs) => {
    if (errs?.fields) {
      errs.fields.forEach((error) => {
        // If the fields have values which were invalidated on the server
        if (formRef.getValues(error.field) === error.value) {
          // Show an error message if necessary
          if (!formRef.errors[error.field]) {
            formRef.setError(error.field, {
              type: 'manual',
              message: error.message,
            })
          }
        // If the value doesn't match, clear the error
        } else if (formRef.errors[error.field]) {
          formRef.clearErrors(error.field)
        }
      })
    }
  }, [formRef])

  React.useEffect(() => {
    // If server-side errors are passed through
    if (errors?.length) {
      mapToKey(errors, 'extensions').map(setErrors)
    }
  }, [errors])

  formRef.setBeforeSubmit = React.useCallback((name, fn) => {
    setBeforeSubmit((bs) => ({ ...bs, name: fn }))
  }, [])

  const runPreflightCheck = React.useCallback(async (formData) => {
    const checks = Object.keys(beforeSubmit)
    if (!checks.length) return true

    // Check all functions
    const result = await Promise.all(checks.map((name) => (
      // call all callbacks, passing formData and formRef
      beforeSubmit[name]({ formData, formRef })
    )))

    // Ensure none return false
    return !result.includes(false)
  }, [beforeSubmit])

  // Merge from data over default values. This ensures that default values are
  // present even if they weren't available as a hidden input on the form.
  formRef.submit = formRef.handleSubmit(async (formData) => {
    const pass = await runPreflightCheck(formData)
    if (pass) onSubmit({ ...defaultValues, ...castFormData({ ref, formData }) })
  })

  formRef.ref = ref

  return formRef
}

const FormProvider = ({ children, ...rest }) => {
  const formRef = useForm(rest)

  return (
    <FormContext.Provider value={formRef}>
      { children }
    </FormContext.Provider>
  )
}

export {
  useForm,
  useFormRef,
  FormProvider,
}
