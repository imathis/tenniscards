import React from 'react'

import { useNavigate } from 'react-router-dom'
import {
  Stack, Shelf, Button, Column,
} from '@level'
import { useDeck } from '@app/hooks/useDeck'
import { courts, aliases } from '@app/helpers/deck'
import { QrCode } from './qr'
import { SliderInput } from './slider'

import './settings.scss'

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
    <Stack space={8} className="deck-settings">
      <h1>Settings</h1>
      <Stack space={5}>
        {
          courts.map((court) => {
            const name = `court${court}`
            const count = courtPlan[name]
            const value = countToValue(count)
            const type = aliases.counts[count]
            return (
              <div className="deck-settings-court" key={`${court}-${name}`}>
                <Shelf space={4}>
                  <label htmlFor={name}>
                    {aliases.courts[name]}
                  </label>
                  <Column grow>
                    <SliderInput
                      id={name}
                      name={name}
                      max={3}
                      value={value}
                      onChange={onChange}
                    />
                  </Column>
                  <Column shrink={false}>
                    <div className="deck-settings-court-count">{ type === 'Empty' ? '' : type }</div>
                  </Column>
                </Shelf>
              </div>
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
      </Stack>
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
