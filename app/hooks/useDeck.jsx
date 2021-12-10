import React from 'react'
import { useParams, Outlet } from 'react-router-dom'
import { useGetQuery as useQuery, isNumber } from '@level'
import {
  useDeckRoutes, players, fullCourts, emptyCourts, aliases,
} from '@app/helpers/deck'

const DeckContext = React.createContext()
const useDeck = () => React.useContext(DeckContext)

// Expects cards in format [{ code: '2S', ...},]
const courtPlanFromInactivePile = (cards = []) => (
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
  const deckRoutes = useDeckRoutes({ deckId })
  const [listInactiveCards, { data: inactiveData }] = useQuery({ url: deckRoutes.pile.list({ pileId: 'inactive' }) })
  const [listDrawnCards, { data: drawnCardsData }] = useQuery({ url: deckRoutes.pile.list({ pileId: 'drawn' }) })
  const [draw, { data: drawData }] = useQuery({ url: deckRoutes.deck.draw() })
  const [returnCards] = useQuery({ url: deckRoutes.deck.return() })
  const [exile, { data: exiled }] = useQuery({ url: deckRoutes.pile.add({ pileId: 'inactive' }) })
  const [addDrawn, { data: drawnPileData }] = useQuery({ url: deckRoutes.pile.add({ pileId: 'drawn' }) })

  const [shuffleDeck, { data: shuffled }] = useQuery({ url: deckRoutes.deck.shuffle() })
  const shuffleAll = React.useCallback(shuffleDeck, [deckId])
  const shuffle = React.useCallback(() => shuffleDeck({ query: { remaining: true } }), [deckId])

  const [courtPlan, setCourtPlan] = React.useState(emptyCourts())
  const [remainingCount, setRemainingCount] = React.useState(0)
  const [drawnCards, setDrawnCards] = React.useState([])
  const [inactiveCards, setInactiveCards] = React.useState([])
  const [ready, setReady] = React.useState()

  const playingCourts = React.useMemo(() => (
    Object.keys(courtPlan).reduce((all, court) => {
      const count = courtPlan[court]
      if (count) return all.concat({ court, count })
      return all
    }, [])
  ), [courtPlan])

  const courtsByType = React.useMemo(() => (
    Object.keys(courtPlan).reduce((all, court) => {
      const count = aliases.counts[courtPlan[court]]
      return ({ ...all, [count]: (all[count] || []).concat(aliases.courts[court]) })
    }, {})
  ), [courtPlan])

  // Returns an array of inactive card codes, e.g. [2S,KH,…]
  const getInactiveCards = React.useCallback((plan) => (
    plan
      ? Object.keys(plan).reduce((all, court) => {
        const count = plan[court]
        // `court2` => `2`
        const courtId = court.replace(/court/, '')
        // Select remainder of court (available suits) and
        // convert player suits to card codes, e.g. 2S
        return all.concat(players.slice(count, 4).map((suit) => `${courtId}${suit}`))
      }, [])
      : []
  ), [])

  const setupDeck = React.useCallback(async (inactivePile) => {
    // Not yet initialized
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
        setCourtPlan(courtPlanFromInactivePile(cards))
      }
    }
  }, [deckId])

  const addInactiveCards = React.useCallback((response) => {
    const cards = response?.piles?.inactive?.cards
    if (cards) setInactiveCards(cards)
  }, [])

  const addDrawnCards = React.useCallback((response) => {
    const cards = response?.piles?.drawn?.cards
    if (cards) setDrawnCards(cards)
  }, [])

  const setCardsRemaining = React.useCallback((val) => {
    if (isNumber(val) && val !== remainingCount) {
      setRemainingCount(val)
    }
  }, [remainingCount])

  const drawCard = React.useCallback(async () => {
    const { data } = await draw()
    if (data?.cards?.length) {
      await addDrawn({ query: { cards: data.cards.map(({ code }) => code) } })
      return data.cards[0]
    }
    return null
  }, [addDrawn, draw])

  const setCourtCount = React.useCallback(({ court, count }) => {
    setCourtPlan((cs) => ({ ...cs, [court]: count }))
  }, [courtPlan])

  const setCourts = React.useCallback(async () => {
    const inactive = getInactiveCards(courtPlan).concat(['X1', 'X2'])
    // Return all inactive cards to the deck
    await shuffleAll()
    // Draw all cards
    await draw({ query: { count: 54 } })
    // Exile all inactive cards
    await exile({ query: { cards: inactive } })
    // Return remaining cards ready to be drawnCards
    await returnCards({ query: { remaining: true } })
    // Shuffle cards
    return shuffle({ query: { remaining: true } })
  }, [courtPlan])

  const resetCourtPlan = React.useCallback(() => {
    setCourtPlan(emptyCourts())
  }, [courtPlan])

  React.useEffect(() => {
    setCardsRemaining(drawData?.remaining)
  }, [drawData])

  React.useEffect(() => {
    console.log(drawnPileData)
    if (drawnPileData?.piles?.drawn?.cards?.length) {
      setDrawnCards((d) => d.concat(drawnPileData?.piles?.drawn?.cards))
    }
  }, [drawnPileData])

  React.useEffect(() => {
    setCardsRemaining(shuffled?.remaining)
    setDrawnCards([])
  }, [shuffled])

  // When inactive pile check completes, if there are no cards in it,
  React.useEffect(() => {
    setupDeck(inactiveData?.piles?.inactive)
    addInactiveCards(inactiveData)
    setCardsRemaining(inactiveData?.remaining)
    setReady(true)
  }, [inactiveData])

  React.useEffect(() => {
    addDrawnCards(drawnCardsData)
  }, [drawnCardsData])

  React.useEffect(() => {
    if (exiled) addInactiveCards(exiled)
  }, [exiled])

  // When deckId changes, check inactive pile
  React.useEffect(() => {
    if (deckId) {
      listInactiveCards()
      listDrawnCards()
    }
  }, [deckId])

  return {
    ready,
    deckId,
    drawCard,
    drawnCards,
    inactiveCards,
    remainingCount,
    courtPlan,
    setCourtCount,
    resetCourtPlan,
    setCourts,
    playingCourts,
    courtsByType,
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
