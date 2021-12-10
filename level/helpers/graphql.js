// Ensure query string is properly formatted with braces
// If a mutation or if it already has braces it returns the query string unmodified
// Otherwise it wraps with braces
const formatQueryString = (query) => {
  const alreadyFormatted = query.match(/mutation/) || query.match(/^{/) || query.match(/^query/)
  return JSON.stringify({
    query: alreadyFormatted ? query : `{ ${query} }`,
  })
}

const formatQueryObject = ({
  query, // GraphQL query string
  signal, // AbortController signal for aborting fetch calls
  headers = {},
}) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...headers,
  },
  body: formatQueryString(query),
  signal,
})

// Wrap fetch in a GraphQL friendly API
const fetchGraphQl = ({
  url, // API endpoint
  query, // GraphQL query string
  signal, // AbortController signal for aborting fetch calls
  headers,
}) => fetch(
  url,
  formatQueryObject({ query, signal, headers }),
)

// Converts an object to a parameter style object.
// 1. Cast to a JSON object and then stringify (which quotes string values).
// 2. Removes quotes around keys and surrounding brackets
// { 'foo': 'bar', baz: 1 } => foo: 'bar', baz: 1
const toParams = (object) => (
  JSON.stringify(object).replace(/"(\w+?)":/g, '$1: ').replace(/^{/, '').replace(/}$/, '')
)

export {
  fetchGraphQl,
  formatQueryObject,
  formatQueryString,
  toParams,
}
