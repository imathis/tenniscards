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
  const courtNumber = aliases.courts[`court${card.split('')[0]}`]
  const { setTheme } = useTheme()
  const [direction, setDirection] = React.useState('next')
  const [cards, setCards] = React.useState([])

  React.useLayoutEffect(() => {
    const courtColor = ['D', 'H'].includes(card.split('')[1]) ? 'red' : 'black'
    setTheme(courtColor)
  }, [card])

  const nextCard = React.useCallback(() => {
    setDirection('next')
    nextCardFn()
  }, [nextCardFn])

  const prevCard = React.useCallback(() => {
    setDirection('back')
    prevCardFn()
  }, [prevCardFn])

  React.useEffect(() => {
    setCards(cardStack)
  }, [cardStack])

  return (
    <div className="court-card-wrapper">
      <div className="card-wrapper">
        <div className="card-stack" data-direction={direction}>
          <TransitionGroup component={null}>
            { cards.map(({ code }) => (
              <CSSTransition
                in
                key={code}
                timeout={{
                  appear: 500,
                  exit: 200,
                }}
                classNames="card"
              >
                <div className="card-stack-item">
                  <Card card={code} fill="currentColor" />
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
          <div className="court-card-label-large-text">Court {courtNumber}</div>
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
