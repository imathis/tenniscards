import React from 'react'

import { useNavigate } from 'react-router-dom'
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
  // to values:     0, 1, 2, 3
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

  const navigate = useNavigate()

  const onChange = React.useCallback(({ target }) => {
    const { value, name } = target
    setCourtCount({ court: name, count: valueToCount(value) })
  }, [])

  const start = React.useCallback(async () => {
    await setCourts()
    navigate('../start', { replace: true })
  }, [])

  if (!courtState) return null

  return (
    <Stack space={5}>
      <h1>Settings {deckId}</h1>
      {
        courts.map((court) => {
          const name = `court${court}`
          const count = courtState[name]
          const value = countToValue(count)
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
                  value={value}
                  onChange={onChange}
                />
                <div>{ count }</div>
              </Shelf>
            </label>
          )
        })
      }
      <Shelf space={8}>
        <Button text="Reset" onClick={resetCourtState} />
        <Button theme="primary" text="Start" onClick={start} />
      </Shelf>
    </Stack>
  )
}

export {
  Settings,
}
