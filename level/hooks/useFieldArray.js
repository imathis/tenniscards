// This wraps the useFieldArray hook from 'react-hook-form'
// Allows us to use the useFormRef hook to pull in the form ref
import {
  useFieldArray as useReactHooksFieldArray,
} from 'react-hook-form'
import { useFormRef } from './useForm'

const useFieldArray = ({ name, formRef = null }) => {
  const { control, register } = formRef || useFormRef()
  return { register, ...useReactHooksFieldArray({ control, name }) }
}

export {
  useFieldArray,
}
