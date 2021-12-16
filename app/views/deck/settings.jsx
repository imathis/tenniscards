import React from 'react'

import { useNavigate } from 'react-router-dom'
import { Stack, Shelf, Button } from '@level'
import { useDeck } from '@app/hooks/useDeck'
import { courts, aliases } from '@app/helpers/deck'

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
    courtPlan,
    setCourtCount,
    setCourts,
    resetCourtPlan,
  } = useDeck()

  const navigate = useNavigate()

  const onChange = React.useCallback(({ target }) => {
    const { value, name: court } = target
    setCourtCount({ court, count: valueToCount(value) })
  }, [])

  const toggleJoker = React.useCallback(({ target }) => {
    const { checked, name: court } = target
    setCourtCount({ court, count: checked ? 1 : 0 })
  }, [])

  const start = React.useCallback(async () => {
    await setCourts()
    navigate('../start', { replace: true })
  }, [setCourts])

  if (!courtPlan) return null

  return (
    <Stack space={5}>
      <h1>Settings {deckId}</h1>
      {
        courts.map((court) => {
          const name = `court${court}`
          const count = courtPlan[name]
          const value = countToValue(count)
          const type = aliases.counts[count]
          return (
            <label htmlFor={name} key={name}>
              <Shelf space={8}>
                {aliases.courts[name]}
                <input
                  type="range"
                  id={name}
                  name={name}
                  min={0}
                  max={3}
                  value={value}
                  onChange={onChange}
                />
                <div>{ type === 'Empty' ? '' : type }</div>
              </Shelf>
            </label>
          )
        })
      }
      <label htmlFor="courtX">
        <Shelf space={4}>
          <input
            id="courtX"
            name="courtX"
            type="checkbox"
            checked={courtPlan.courtX === 1}
            onChange={toggleJoker}
          />
          <div>Add a Joker</div>
        </Shelf>
      </label>
      <Shelf space={8}>
        <Button text="Reset" onClick={resetCourtPlan} />
        <Button theme="primary" text="Start" onClick={start} />
      </Shelf>
    </Stack>
  )
}

export {
  Settings,
}
