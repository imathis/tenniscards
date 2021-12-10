import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { searchToObject, toSearchString, filterTruthyValues } from '../helpers'

const useSearchParams = () => {
  const { search } = useLocation()
  return React.useMemo(() => searchToObject(search), [search])
}

const useReplaceSearchParams = () => {
  const { pathname, search } = useLocation()
  const history = useNavigate()

  return React.useCallback((obj) => {
    const searchObj = filterTruthyValues({ ...searchToObject(search), ...obj })

    const url = Object.keys(searchObj).length ? `${pathname}?${toSearchString(searchObj)}` : pathname
    history.replace(url)
  }, [search, pathname])
}

// useState which updates search parameters when changed
const useSearchState = (obj) => {
  const searchParams = useSearchParams()
  const name = Object.keys(obj)[0]
  const stateDefault = React.useMemo(() => Object.values(obj)[0])
  const replaceSearchParams = useReplaceSearchParams()
  const isArray = Array.isArray(stateDefault)
  const searchValue = searchParams[name]

  // if a state expects to be an array, parse the url like one.
  const searchDefault = isArray ? searchValue?.split(',') : searchValue

  // Cast values to boolean
  const defaultValue = (() => {
    const v = searchDefault || stateDefault
    if (v === 'true') return true
    if (v === 'false') return false
    return v
  })()

  const [val, setVal] = React.useState(defaultValue)

  React.useEffect(() => {
    if (searchValue !== val) {
      // using val?.toString() to let empty arrays be saved as null
      replaceSearchParams({ [name]: val?.toString() ? val : null })
    }
  }, [val, searchValue])

  return [val, setVal]
}

export {
  useSearchState,
  useSearchParams,
  useReplaceSearchParams,
}
