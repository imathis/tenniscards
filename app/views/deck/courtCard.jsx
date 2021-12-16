import React from 'react'
import PropTypes from 'prop-types'
import { aliases } from '@app/helpers/deck'
import { useTheme } from '@app/hooks/useTheme'
// import { Transition } from '@level'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { Card } from './card'

const CourtCard = ({
  card,
  nextCard: nextCardFn,
  prevCard: prevCardFn,
  cardStack,
}) => {
  const courtNumber = React.useMemo(() => {
    const court = card.split('')[0]
    if (court === 'X') return 'Rotation'

    const number = aliases.courts[`court${court}`]
    return `Court ${number}`
  }, [card])

  const { setTheme } = useTheme()
  const [cards, setCards] = React.useState([])

  React.useLayoutEffect(() => {
    const courtColor = ['D', 'H'].includes(card.split('')[1]) ? 'red' : 'black'
    // Joker
    if (card === 'X1') setTheme('purple')
    else setTheme(courtColor)
  }, [card])

  const nextCard = React.useCallback(() => {
    nextCardFn()
  }, [nextCardFn])

  const prevCard = React.useCallback(() => {
    prevCardFn()
  }, [prevCardFn])

  React.useEffect(() => {
    setCards(cardStack)
  }, [cardStack])

  return (
    <div className="court-card-wrapper">
      <div className="card-wrapper">
        <div className="card-stack">
          <TransitionGroup component={null}>
            { cards.map(({ code }) => (
              <CSSTransition
                key={code}
                timeout={{
                  appear: 100,
                  exit: 100,
                }}
                classNames="card"
              >
                <div className="card-stack-item">
                  <Card card={code} />
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      </div>
      <div className="court-card-label">
        <div className="court-card-label-small">
          <div className="court-card-label-small-text">you have drawn</div>
        </div>
        <div className="court-card-label-large">
          <div className="court-card-label-large-text">{courtNumber}</div>
        </div>
        <div className="court-card-label-curtain" />
      </div>
      <button
        type="button"
        onClick={prevCard}
        className="prev-card"
        aria-label="previous card"
      >Previous Card
      </button>
      <button
        type="button"
        onClick={nextCard}
        className="next-card"
        aria-label="next card"
      >Previous Card
      </button>
    </div>
  )
}

CourtCard.propTypes = {
  card: PropTypes.string.isRequired,
  nextCard: PropTypes.func.isRequired,
  prevCard: PropTypes.func.isRequired,
  cardStack: PropTypes.array,
}

CourtCard.defaultProps = {
  cardStack: [],
}

export {
  CourtCard,
}
