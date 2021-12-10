import { useMatch } from 'react-router-dom'

// I want to be able to match multiple routes
const useRouteMatch = (...routes) => {
  const matches = routes.map((route) => (
    // Allow me to pass a route oject too
    useMatch(route?.path || route)
  )).filter((r) => !!r)
  return matches.length ? matches : null
}

export {
  useRouteMatch,
}
