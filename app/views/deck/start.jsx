import React from 'react'
import { useDeck } from '@app/hooks/useDeck'
import { Stack, Shelf } from '@level'

const Start = () => {
  const {
    ready,
    drawnCards,
    inactiveCards,
    courtState,
    remainingCount,
  } = useDeck()

  if (ready) {
    return (
      <Stack space={5}>
        <Shelf space={5}>
          <div>Drawn:</div>
          <div>{ drawnCards.length }</div>
        </Shelf>
        <Shelf space={5}>
          <div>Inactive:</div>
          <div>{ inactiveCards.length }</div>
        </Shelf>
      </Stack>
    )
  }

  return 'Loading…'
}

export {
  Start,
}
