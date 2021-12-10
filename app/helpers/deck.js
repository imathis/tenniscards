import { replaceSymbols, toSearchString } from '@level'

const apiUrl = process.env.API_BASE_URL

const deckPaths = {
  new: '/new/shuffle/',
  index: '/:deckId',
  shuffle: '/:deckId/shuffle/',
  draw: '/:deckId/draw/',
  return: '/:deckId/return/',
}

const pilePaths = {
  list: '/pile/:pileId/list/',
  add: '/pile/:pileId/add/',
  shuffle: '/pile/:pileId/shuffle/',
  draw: '/pile/:pileId/draw/',
  drawRandom: '/pile/:pileId/draw/random/',
  drawBottom: '/pile/:pileId/draw/bottom/',
  return: '/pile/:pileId/return/',
}

const useRoute = ({ root, routes, params = {} }) => Object.keys(routes).reduce((all, route) => ({
  ...all,
  [route]: (obj = {}) => {
    const urlString = replaceSymbols(`${root}${routes[route]}`, { ...params, ...obj })
    return obj?.search && Object.keys(obj.search).length ? `${urlString}?${toSearchString(obj.search)}` : urlString
  },
}), {})

const useDeckRoutes = (params = {}) => ({
  deck: useRoute({ root: apiUrl, routes: deckPaths, params }),
  pile: useRoute({ root: `${apiUrl}${deckPaths.index}`, routes: pilePaths, params }),
})

const courts = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K']
const players = ['C', 'D', 'H', 'S']

const initCourts = (options) => (
  courts.reduce((all, court) => (
    { ...all, [`court${court}`]: options?.full ? 4 : 0 }
  ), {})
)

const emptyCourts = () => initCourts({ full: false })
const fullCourts = () => initCourts({ full: true })

const valueToCount = (value) => {
  const number = Number.parseInt(value, 10)
  // allow values 0, 2, 3, 4
  return number ? number + 1 : number
}

export {
  useDeckRoutes,
  emptyCourts,
  fullCourts,
  valueToCount,
  courts,
  players,
}
