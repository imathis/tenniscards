import React from 'react'
import { useDeck } from '@app/hooks/useDeck'
import {
  Button, Stack, Shelf, pluralize,
} from '@level'

const Draw = () => {
  const { drawCard, drawnCards } = useDeck()
  const [drawn, setDrawn] = React.useState([])

  const getCard = (position = drawn.length - 1) => drawn[position]
  const getCardGraphic = () => getCard().images.png

  const draw = React.useCallback(async () => {
    const card = await drawCard()
    setDrawn((d) => (d || []).concat(card))
  }, [drawn])

  React.useEffect(async () => {
    draw()
  }, [])

  if (drawn.length) {
    return (
      <Stack space={5}>
        <svg src={getCardGraphic()} />
        <Button onClick={draw} text="Draw Again" />
      </Stack>
    )
  }
  return 'Drawing…'
}

export {
  Draw,
}
