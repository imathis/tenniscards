import React from 'react'
import { useParams, Outlet } from 'react-router-dom'
import { useGetQuery as useQuery } from '@level'
import {
  useDeckRoutes, players, fullCourts, emptyCourts,
} from '@app/helpers/deck'

const DeckContext = React.createContext()
const useDeck = () => React.useContext(DeckContext)

// Expects cards in format [{ code: '2S', ...},]
const courtStateFromInactivePile = (cards = []) => (
  cards.reduce((all, { code }) => {
    // get court from split '2S' => '2'
    const [court] = code.split('')
    // Reference the courts by 'court2' instead of '2'
    // to avoid positional storage in the object
    const courtName = `court${court}`
    // Start with a full court
    const count = all[courtName]
    // Subtract inactive card from court size
    return { ...all, [courtName]: count - 1 }
  }, fullCourts())
)

const filterJokers = ({ cards = [] }) => (
  cards.filter(({ code }) => !code.startsWith('X'))
)

const useDeckSession = ({ deckId }) => {
  const deckRoutes = useDeckRoutes({ deckId, pileId: 'inactive' })
  const [checkPile, { data: pileData }] = useQuery({ url: deckRoutes.pile.list() })
  const [draw, { data: drawData }] = useQuery({ url: deckRoutes.deck.draw() })
  const [returnCards] = useQuery({ url: deckRoutes.deck.return() })
  const [exile] = useQuery({ url: deckRoutes.pile.add() })

  const [shuffleDeck] = useQuery({ url: deckRoutes.deck.shuffle() })
  const shuffleAll = React.useCallback(shuffleDeck, [deckId])
  const shuffle = React.useCallback(() => shuffleDeck({ query: { remaining: true } }), [deckId])

  const [courtState, setCourtState] = React.useState(emptyCourts())

  // Returns an array of inactive card codes, e.g. [2S,KH,…]
  const getInactiveCards = React.useCallback(() => (
    courtState
      ? Object.keys(courtState).reduce((all, court) => {
        const count = courtState[court]
        // `court2` => `2`
        const courtId = court.replace(/court/, '')
        // Select remainder of court (available suits) and
        // convert player suits to card codes, e.g. 2S
        return all.concat(players.slice(count, 4).map((suit) => `${courtId}${suit}`))
      }, [])
      : []
  ), [courtState])

  const setupDeck = React.useCallback(async (inactivePile) => {
    if (!inactivePile) return
    // If there are no jokers in exile, this is a new deck
    if (!inactivePile.cards) {
      // Draw all cards (including jokers)
      await draw({ query: { count: 54 } })
      // Exlie Jokers to inactive pile
      // This is a state marker for a deck in use
      await exile({ query: { cards: ['X1', 'X2'] } })
      // Initialize court state
    } else {
      const cards = filterJokers(inactivePile)
      // If there are non-Joker inactive cards
      if (cards.length) {
        setCourtState(courtStateFromInactivePile(cards))
      }
    }
  }, [deckId])

  const remaining = React.useMemo(() => (drawData ? drawData.remaining : null), [drawData])

  // When deckId changes, check inactive pile
  React.useEffect(() => {
    if (deckId) checkPile()
  }, [deckId])

  // When inactive pile check completes, if there are no cards in it,
  // This must be a new deck, so set the deck up
  React.useEffect(async () => {
    setupDeck(pileData?.piles?.inactive)
  }, [pileData])

  const setCourtCount = React.useCallback(({ court, count }) => {
    setCourtState((cs) => ({ ...cs, [court]: count }))
  }, [courtState])

  const setCourts = React.useCallback(async () => {
    const inactive = getInactiveCards().concat(['X1', 'X2'])
    // Return all inactive cards to the deck
    await shuffleAll()
    // Draw all cards
    await draw({ query: { count: 54 } })
    // Exile all inactive cards
    await exile({ query: { cards: inactive } })
    // Return remaining cards ready to be drawn
    await returnCards({ query: { remaining: true } })
    // Shuffle cards
    await shuffle({ query: { remaining: true } })
  }, [courtState])

  const resetCourtState = React.useCallback(() => {
    setCourtState(emptyCourts())
  }, [courtState])

  return {
    deckId,
    remaining,
    courtState,
    setCourtCount,
    resetCourtState,
    setCourts,
    deckRoutes,
  }
}

const DeckProvider = () => {
  const { deckId } = useParams()
  const deckSession = useDeckSession({ deckId })
  return (
    <DeckContext.Provider value={deckSession}>
      <Outlet />
    </DeckContext.Provider>
  )
}

export {
  DeckProvider,
  useDeck,
}
