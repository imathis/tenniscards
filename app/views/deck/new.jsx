import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetQuery as useQuery } from '@level'
import { useDeckRoutes } from '@app/helpers/deck'

const NewDeck = () => {
  const [deckId, setDeckId] = React.useState()
  const deckRoutes = useDeckRoutes({ pileId: 'inactive', deckId })
  const navigate = useNavigate()
  const [initDeck, { data }] = useQuery({ url: deckRoutes.deck.new() })
  const [createPile, { data: pileData }] = useQuery({ url: deckRoutes.pile.add() }, [deckRoutes])

  React.useEffect(() => {
    initDeck({ query: { jokers_enabled: true } })
  }, [])

  React.useEffect(() => {
    if (data?.deck_id) {
      setDeckId(data.deck_id)
    }
  }, [data])

  React.useEffect(() => {
    if (deckId) {
      createPile({ query: { cards: '' } })
    }
  }, [deckId])

  console.log(deckId)

  React.useEffect(() => {
    if (pileData) navigate(`../${deckId}`, { replace: true })
  }, [pileData])

  return (
    <h1>NewDeck</h1>
  )
}

export {
  NewDeck,
}
