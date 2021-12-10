import React from 'react'
import {
  mapToKey, fetchGraphQl, postJson, getJson,
} from '../helpers'

const useQuery = ({
  query,
  url,
  handleQuery,
  handleErrors = [],
}, dependencies = []) => {
  const [data, setData] = React.useState(null)
  const [errors, setErrors] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [queryId, setQueryId] = React.useState(0)
  const [controller, setController] = React.useState(null)

  const sendQuery = React.useCallback(async ({ canAbort = true, ...rest }) => {
    // Create a new abort controller
    const fetchController = new AbortController()

    // If a controller is passed in from a previous fetch state, abort that fetch
    if (canAbort) {
      if (controller) controller.abort()
      setController(fetchController)
    }

    let fetchErrors
    let json

    try {
      const queryResponse = await handleQuery({
        ...rest,
        url,
        signal: fetchController.signal,
      })
      json = await queryResponse.json()

      if (process.env.LOG_QUERIES === 'true') {
        /* eslint-disable no-console */
        if (json.data) {
          Object.keys(json.data).forEach((res) => {
            console.log(res)
            console.table(json.data[res])
          })
        }
        /* eslint-enable no-console */
      }
    } catch (er) {
      fetchErrors = er
    }

    setController(null)

    // If we couldn't fetch, return the fetch error
    if (fetchErrors) return { errors: fetchErrors }
    // If there were json errors, return the json object, { data, errors }
    if (json.errors?.length) return json
    // If there were no json errors, return only the data
    return { data: json.data || json }
  }, [...dependencies, controller, url])

  const fetchData = React.useCallback(async (options = {}) => {
    const { query: queryProp, ...opts } = options
    setErrors(null)
    const q = (queryProp && typeof query === 'function') ? query(queryProp) : (queryProp || query)

    // Do we have multiple queries chained together as an array
    // This will help us decied whether to return the response as an array
    const bulkQuery = Array.isArray(q)

    setIsLoading(true)

    // Execute query as an array of promises
    const response = await Promise.all([].concat(q).map(
      (queryData) => sendQuery({
        query: queryData,
        ...opts,
      }),
    ))

    // Collect response errors filtering out empty data
    const Err = mapToKey(response, 'errors')
    if (Err.length) setErrors(Err)

    // Collect response data, filtering out empty data
    const Data = mapToKey(response, 'data')
    if (Data.length) setData(!bulkQuery ? Data[0] : Data)

    setQueryId((c) => c + 1)
    setIsLoading(false)

    return !bulkQuery ? response[0] : response
  }, [...dependencies, query])

  // If component unmounts cancel the request
  React.useEffect(() => () => {
    if (controller) { controller.abort() }
  }, [controller])

  React.useEffect(() => {
    if (errors?.length && handleErrors?.length) {
      errors.map(handleErrors)
    }
  }, [errors])

  return [fetchData, {
    data, errors, isLoading, queryId,
  }]
}

const handleGraphQlQuery = ({
  url, query, headers, signal,
}) => fetchGraphQl({
  url,
  query,
  headers,
  // do not allow mutations to be aborted
  signal: !query.includes('mutation') ? signal : null,
})

const useGraphQlQuery = (props, dependencies = []) => useQuery({
  handleQuery: handleGraphQlQuery,
  ...props,
}, dependencies)

const usePostQuery = (props, dependencies = []) => useQuery({
  handleQuery: postJson,
  ...props,
}, dependencies)

const useGetQuery = (props, dependencies = []) => useQuery({
  handleQuery: getJson,
  ...props,
}, dependencies)

export {
  useQuery,
  usePostQuery,
  useGetQuery,
  useGraphQlQuery,
}
