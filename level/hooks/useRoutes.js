import React from 'react'
import { camelToTitle, replaceSymbols, toSearchString } from '../helpers'

const titleizeUrl = (path) => (
  camelToTitle(path.match(/.+\/:*(.+)$/)[1])
)

// Returns path and URL helpers from a route object
//
// 1. Accepts an object of routes, for example:
// {
//   index: {
//     path: '/projects',
//     root: 'http://external.app'
//     ...
//   },
//
//   show: {
//     title: 'Project :name',
//     path: '/projects/:projectId',
//     ...
//   }
// }
//
// 2. Accepts an object of params (to replace symbols in routes and titles):
// For example:
//
// { projectId: 1 }
//
// 3. Accepts `canViewRoute` a function to determine view permissions.
//
// This function will be passed the route object (like `index` in the example above).
// It must return a boolean to set the `canView` key on the resultant route.
//
// For example, this permission callback destructures `adminOnly` from the route:
//
// canViewRoute = ({ adminOnly }) => (
//   adminOnly ? adminOnly === currentUser.isAdmin : true
// )
//
//
// Returns a memoized object:
// {
//   index: {
//     title: ({obj}) => 'Projects',
//     path: '/projects',
//     url: () => 'http://external.app/projects',
//     canView: true,
//     root: 'http://external.app',
//   },
//
//   show: {
//     title: ({obj}) => 'Awesome Project' // called as title({ name: 'Awesome Project' })
//     path: '/projects/:projectId',
//     url: ({obj}) => '/projects/1', // called as url({ projectId: 1 }) or params have `projectId`
//     canView: false, // if permission callback returns false
//     root: '',
//   }
// }
// Note: Symbols in routes will be autofilled from url parameters or function props
//
const objectToRoutes = ({
  routes,
  params = {},
  canViewRoute = null,
  setRoot = null,
}) => (
  Object.keys(routes).reduce((allroutes, route) => {
    const {
      path,
      title = titleizeUrl(path),
      root = '',
    } = routes[route]

    // setRoot lets us change the root when renedered
    const getRoot = () => (setRoot ? setRoot(root) : root)

    const url = (obj = {}) => {
      const urlString = `${getRoot()}${replaceSymbols(path, { ...params, ...obj })}`
      return obj?.search && Object.keys(obj.search).length ? `${urlString}?${toSearchString(obj.search)}` : urlString
    }
    const routeTitle = (obj = {}) => replaceSymbols(title, { ...params, ...obj })
    const canView = canViewRoute ? canViewRoute(routes[route]) : true
    const linkProps = (props = {}) => {
      const {
        text,
        params: urlParams = {},
        ...rest
      } = props

      return ({
        text: text || routeTitle(urlParams),
        to: url(urlParams),
        ...rest,
      })
    }

    return {
      ...allroutes,
      [route]: {
        path,
        url,
        root,
        title: routeTitle,
        canView,
        linkProps,
      },
    }
  }, {})
)

// Memoize objectToRoutes
const useRoutes = ({
  routes, params, canViewRoute, setRoot,
}) => React.useMemo(() => (
  objectToRoutes({
    routes, params, canViewRoute, setRoot,
  })
), [routes, params, canViewRoute, setRoot])

// A simple hook to wrap history.replace for useRoute objects.
// This lets you pass objects to be interpolated into strings
// through the `url` function of a route object.
//
// Example usage: (assume `routes` is an object created with useRoutes hook)
//
// const showItem = useRouteReplace(routes.show)
// showItem({ item: 21 }) // Will replace the url with '…/item/21'
// showItem({ search: { foo: 'bar' }}) // Will replace the url with '…?foo=bar'
//
//
const useRouteReplace = ({ url }) => React.useCallback((obj) => {
  window.history.replaceState(obj?.state || {}, '', url(obj))
}, [url])

// Same as useRouteReplace but pushes the url onto the history stack
const useRoutePush = ({ url }) => React.useCallback((obj) => {
  window.history.pushState(obj?.state || {}, '', url(obj))
}, [url])

export {
  objectToRoutes,
  useRoutes,
  useRouteReplace,
  useRoutePush,
}
