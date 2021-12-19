import React from 'react'

import { CourtCard } from './courtCard'
import { SliderInput } from './slider'

const Test = () => {
  // All drawn cards from all sessions
  const drawnCards = React.useMemo(() => ['X1', 'AS', 'JD', '3C', 'QH', '3S', 'JS', 'QD', 'KH'].map((code) => ({ code })), [])
  // Track position of card drawing/viewing
  const [position, setPosition] = React.useState(0)

  const prevCard = React.useCallback(() => {
    if (position !== 0) { setPosition(position - 1) }
  }, [position])

  const nextCard = React.useCallback(() => {
    if (position + 1 !== drawnCards.length) {
      setPosition(position + 1)
    }
  }, [position])

  const card = drawnCards[position]?.code

  const cardStack = React.useMemo(() => (
    drawnCards.slice(0, position + 1).reverse()
  ), [drawnCards, position])

  if (card) {
    return <SliderInput />
  }

  if (!card) {
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
  Test,
}
