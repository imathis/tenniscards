import { useToast } from '@level'
//import { useBugsnag } from './useBugsnag'

const getErrorMetadata = ({ message, extensions }) => {
  const { code, title } = extensions || {}
  if (code === 'not_valid') {
    return {
      type: code,
      message: {
        title: 'Form Error', message, timeout: 2500, replace: false,
      },
    }
  }
  if (code) return { type: code, message: { title, message, replace: false } }
  return { type: 'error', message: { title: 'Unspecified Error', message: 'We are so sorry.', replace: false } }
}

const useHandleErrors = () => {
  const { sendError } = useToast()
  //const Bugsnag = useBugsnag()

  const handleErrors = (er) => {
    if (Array.isArray(er)) {
      er.map(handleErrors)
    } else {
      const meta = getErrorMetadata(er)
      if (meta.type === 'error') {
        //Bugsnag.leaveBreadcrumb('Unspecified Error')
        //Bugsnag.notify(new Error(er.message), (ev) => (
          //ev.addMetadata('Error Object', er)
        //))
      }
      if (meta.message) sendError(meta.message)
    }
  }

  return handleErrors
}

export {
  useHandleErrors,
}
