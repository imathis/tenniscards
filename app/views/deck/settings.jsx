import React from 'react'

import { useNavigate } from 'react-router-dom'
import { Stack, Shelf, Button } from '@level'
import { useDeck } from '@app/hooks/useDeck'
import { courts, aliases } from '@app/helpers/deck'

import './settings.scss'

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
    setCourtCount({ court, count: Number.parseInt(value, 10) })
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
      <h1>Court Plan</h1>
      <Stack space={4}>
        { courts.map((court) => {
          const name = `court${court}`
          const count = courtPlan[name]
          return (
            <div className="deck-settings-court">
              <Shelf
                key={court}
                valign="center"
                space={4}
              >
                <div
                  style={{ minWidth: '1em' }}
                  className="deck-settings-court-label"
                >{aliases.courts[name]}
                </div>
                { [0, 2, 3, 4].map((num) => (
                  <label htmlFor={`${name}-${num}`} key={`${name}-${num}`}>
                    <input
                      type="radio"
                      id={`${name}-${num}`}
                      name={name}
                      value={num}
                      checked={num === count}
                      onChange={onChange}
                    />
                    <div className="deck-settings-court-count">
                      { aliases.counts[num] }
                    </div>
                  </label>
                ))}
              </Shelf>
            </div>
          )
        })}
      </Stack>
      <label htmlFor="courtX" className="deck-settings-court">
        <input
          id="courtX"
          name="courtX"
          type="checkbox"
          checked={courtPlan.courtX === 1}
          onChange={toggleJoker}
        />
        <div className="deck-settings-court-count add-joker">
          Add a Joker
        </div>
      </label>
      <Shelf space={8} align="split">
        <Button text="Reset" onClick={resetCourtPlan} />
        <Button theme="primary" text="Next" onClick={start} />
      </Shelf>
    </Stack>
  )
}

export {
  Settings,
}
