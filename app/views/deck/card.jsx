import React from 'react'
import PropTypes from 'prop-types'
import { aliases } from '@app/helpers/deck'
import { useTheme } from '@app/hooks/useTheme'
import { useParams } from 'react-router-dom'
import { useSwipe } from 'beautiful-react-hooks'
import { SvgIcon } from '@level'

import * as cards from '@app/assets/icons'

import './card.scss'

const CardSvg = ({
  width = '224',
  height = '312',
  fill = '#fff',
  children,
}) => (
  <svg
    className="court-card"
    style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    version="1.1"
    viewBox={`0 0 ${width} ${height}`}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <rect
      fill={fill}
      width={width}
      height={height}
      ry="12"
    />
    { children }
  </svg>
)

const CardIcon = ({ name, ...props }) => {
  const svg = cards[`card${name}`]
  return (
    <CardSvg>
      <SvgIcon fill="#000" svg={svg} {...props} />
    </CardSvg>
  )
}

CardIcon.propTypes = {
  name: PropTypes.oneOf(Object.keys(cards).map((n) => n.replace(/card/, ''))).isRequired,
}

const Card = ({ card, nextCard, prevCard }) => {
  const { cardId = card } = useParams()
  const ref = React.useRef()
  const { setTheme } = useTheme()
  const { swipeCount, direction } = useSwipe(ref, {
    direction: 'horizontal', threshold: 10, preventDefault: true,
  })

  const courtColor = React.useMemo(() => (
    ['D', 'H'].includes(cardId.split('')[1]) ? 'red' : 'black'
  ), [cardId])

  const courtNumber = React.useMemo(() => (
    aliases.courts[`court${cardId.split('')[0]}`]
  ), [cardId])

  React.useLayoutEffect(() => {
    setTheme(courtColor)
  }, [courtColor])

  React.useEffect(() => {
    if (swipeCount && direction === 'left') nextCard()
    if (swipeCount && direction === 'right') prevCard()
  }, [swipeCount])

  return (
    <div className="court-card-wrapper" ref={ref}>
      <CardIcon name={cardId} className="court-card" />
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

Card.propTypes = {
  card: PropTypes.string,
  nextCard: PropTypes.func,
  prevCard: PropTypes.func,
}

Card.defaultProps = {
  card: 'QH',
  nextCard: () => console.log('next'),
  prevCard: () => console.log('prev'),
}

export { Card }
