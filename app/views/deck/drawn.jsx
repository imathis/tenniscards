import React from 'react'
import { useDeck } from '@app/hooks/useDeck'

import { CourtCard } from './courtCard'

const Drawn = () => {
  // All drawn cards from all sessions
  const { drawCard, drawnCards } = useDeck()
  // Track cards drawn in this session
  const [drawn, setDrawn] = React.useState([])
  // Track position of card drawing/viewing
  const [position, setPosition] = React.useState(0)

  React.useEffect(() => {
    // if (drawnCards?.length) setPosition(drawnCards.length - 1)
  }, [drawnCards])

  const prevCard = React.useCallback(() => {
    if (position !== 0) { setPosition(position - 1) }
  }, [position])

  const nextCard = React.useCallback(() => {
    if (position + 1 !== drawn.length) {
      setPosition(position + 1)
    }
  }, [position])

  const card = drawnCards[position]?.code

  const cardStack = React.useMemo(() => (
    drawnCards.slice(0, position + 1).reverse()
  ), [drawnCards, position])

  if (card) {
    return (
      <CourtCard
        card={card}
        nextCard={nextCard}
        prevCard={prevCard}
        cardStack={cardStack}
      />
    )
  }
  return 'Drawing…'
}

export {
  Drawn,
}
