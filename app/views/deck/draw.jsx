import React from 'react'
import { useDeck } from '@app/hooks/useDeck'
import {
  Button, Stack, Shelf, pluralize,
} from '@level'

import { Card } from './card'

const Draw = () => {
  // All drawn cards from all sessions
  const { drawCard, drawnCards } = useDeck()
  // Track cards drawn in this session
  const [drawn, setDrawn] = React.useState([])
  // Track position of card drawing/viewing
  const [position, setPosition] = React.useState(0)

  const draw = React.useCallback(async () => {
    const newCard = await drawCard()
    setDrawn((d) => d.concat(newCard))
    setPosition(drawn.length)
  }, [drawn, position])

  React.useEffect(async () => {
    draw()
  }, [])

  const prevCard = React.useCallback(() => {
    if (position) { setPosition(position - 1) }
  }, [position])

  const nextCard = React.useCallback(() => {
    if (position + 1 === drawn.length) {
      draw()
    } else {
      setPosition(position + 1)
    }
  }, [drawn, position])

  const card = drawn[position]
  const cardCode = card?.code

  if (drawn.length) {
    return (
      <Stack space={5}>
        <Card
          card={cardCode}
          nextCard={nextCard}
          prevCard={prevCard}
        />
      </Stack>
    )
  }
  return 'Drawing…'
}

export {
  Draw,
}
