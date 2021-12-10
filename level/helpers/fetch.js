import { toSearchString } from './object'

const postJson = ({
  url,
  query,
  signal,
  headers = {},
  method = 'POST',
}) => fetch(url, {
  method,
  headers: {
    'Content-Type': 'application/json',
    ...headers,
  },
  body: JSON.stringify(query),
  signal,
})

const getJson = ({
  url,
  query = {},
  signal,
  headers = {},
}) => fetch(`${url}?${toSearchString(query)}`, {
  headers: {
    'Content-Type': 'application/json',
    ...headers,
  },
  signal,
})

export {
  getJson,
  postJson,
}
