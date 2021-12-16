import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { CardSvg } from '@app/components/Card'

import './card.scss'

const Card = ({ card, ...props }) => {
  const { cardId = card } = useParams()
  return (
    <CardSvg name={cardId} {...props} />
  )
}

Card.propTypes = {
  card: PropTypes.string,
}

Card.defaultProps = {
  card: 'QH',
}

export { Card }
