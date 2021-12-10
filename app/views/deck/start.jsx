import React from 'react'
import { useDeck } from '@app/hooks/useDeck'
import {
  Button, Stack, Shelf, pluralize,
} from '@level'

const Start = () => {
  const {
    ready,
    drawnCards,
    inactiveCards,
    courtsByType,
    remainingCount,
  } = useDeck()

  if (ready) {
    return (
      <Stack space={5}>
        <Shelf space={5}>
          <div>Already drawn:</div>
          <div>{ drawnCards.length }</div>
        </Shelf>
        <Shelf space={5}>
          <div>Players:</div>
          <div>Waiting: { remainingCount }</div>
          <div>Total: { remainingCount }</div>
        </Shelf>
        { Object.keys(courtsByType).map((type) => (type === 'Empty' ? null : (
          <Shelf space={4} key={type}>
            <div>{ type }:</div>
            <div>{ pluralize('Court', courtsByType[type]) }: { courtsByType[type].join(',') }</div>
          </Shelf>
        )))}
        <Shelf space={5}>
          <div>Inactive:</div>
          <div>{ inactiveCards.length }</div>
        </Shelf>

        <Shelf space={8}>
          <Button text="Settings" to="../settings" />
          <Button theme="primary" text="Draw" to="../draw" />
        </Shelf>
      </Stack>
    )
  }

  return 'Loading…'
}

export {
  Start,
}
