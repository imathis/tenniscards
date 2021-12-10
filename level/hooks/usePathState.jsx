import React from 'react'
import {
  matchPath, useLocation, useNavigate, useParams,
} from 'react-router-dom'
import { replaceSymbols } from '../helpers'

const usePathParams = (path, param) => {
  const { pathname } = useLocation()

  return React.useMemo(() => {
    const match = matchPath(pathname, { path })
    return match ? match.params[param] : null
  }, [pathname, param, path])
}

// useState which updates search parameters when changed
const usePathState = ({ base, path = `${base}/:param` }) => {
  const [paramName] = path.match(/:\w+$/) || [':param']
  const param = paramName.replace(':', '')

  const history = useNavigate()
  const pathValue = usePathParams(path, param)
  const params = useParams()
  const [value, setValue] = React.useState(pathValue)

  const setParamValue = React.useCallback((v) => {
    setValue(v)
    const hasValue = v !== null && typeof v !== 'undefined'

    if (!hasValue) {
      const url = replaceSymbols(base, params)
      history.replace(url)
    } else if (v !== pathValue) {
      const url = replaceSymbols(path, { ...params, [param]: v })
      history.replace(url)
    }
  }, [params])

  React.useEffect(() => {
    if (value !== pathValue) {
      setValue(pathValue)
    }
  }, [pathValue])

  return [value, setParamValue]
}

export {
  usePathState,
}
