import React from 'react'

import { Stack, Shelf, Button } from '@level'
import { useDeck } from '@app/hooks/useDeck'
import { courts } from '@app/helpers/deck'

const valueToCount = (value) => {
  const number = Number.parseInt(value, 10)
  // convert values 0, 1, 2, 3
  // to counts 0, 2, 3, 4
  return number ? number + 1 : number
}

const countToValue = (value) => {
  const number = Number.parseInt(value, 10)
  // convert counts 0, 2, 3, 4
  // to values: 0,1,2,3
  return number ? number - 1 : number
}

const Settings = () => {
  const {
    deckId,
    courtState,
    setCourtCount,
    setCourts,
    resetCourtState,
  } = useDeck()

  const onChange = React.useCallback(({ target }) => {
    const { value, name } = target
    setCourtCount({ court: name, count: valueToCount(value) })
  }, [])

  console.log(courtState)

  if (!courtState) return null

  return (
    <Stack space={5}>
      <h1>Settings {deckId}</h1>
      {
        courts.map((court) => {
          const name = `court${court}`
          return (
            <label htmlFor={name} key={name}>
              <Shelf space={8}>
                {court}
                <input
                  type="range"
                  id={name}
                  name={name}
                  min={0}
                  max={3}
                  value={countToValue(courtState[name])}
                  onChange={onChange}
                />
                <div>{ courtState[name] }</div>
              </Shelf>
            </label>
          )
        })
      }
      <Shelf space={8}>
        <Button text="Reset" onClick={resetCourtState} />
        <Button theme="primary" text="Start" onClick={setCourts} />
      </Shelf>
    </Stack>
  )
}

export {
  Settings,
}
