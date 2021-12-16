import React from 'react'
import { useDeck } from '@app/hooks/useDeck'
import { useSwipe } from 'beautiful-react-hooks'

import { CourtCard } from './courtCard'

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

  const card = drawn[position]?.code

  const ref = React.useRef()
  const { swipeCount, direction } = useSwipe(ref, {
    direction: 'horizontal', threshold: 10, preventDefault: true,
  })

  React.useEffect(() => {
    if (swipeCount && direction === 'left') nextCard()
    if (swipeCount && direction === 'right') prevCard()
  }, [swipeCount])

  const cardStack = React.useMemo(() => (
    drawn.slice(0, position)
  ), [position, drawn])

  if (card) {
    return (
      <div ref={ref}>
        <CourtCard
          card={card}
          nextCard={nextCard}
          prevCard={prevCard}
          cardStack={cardStack}
        />
      </div>
    )
  }
  return 'Drawing…'
}

export {
  Draw,
}
