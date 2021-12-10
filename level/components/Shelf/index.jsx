import React from 'react'
import PropTypes from 'prop-types'
import { spaceToSize, isOfType } from '../../helpers'
import { Grid } from '../Grid'
import { Column } from '../Column'

const Shelf = React.forwardRef(({ children, ...rest }, ref) => (
  <Grid {...rest} ref={ref}>
    {React.Children.map(children, (child) => (
      (!child || isOfType(child, 'Column'))
        ? child
        : <Column>{child}</Column>
    ))}
  </Grid>
))

Shelf.defaultProps = {
  shrink: true,
}

Shelf.propTypes = Grid.propTypes

const Spacer = ({ grow, space, columns }) => {
  const direction = columns === 1 ? 'height' : 'width'
  return (
    <div
      className="shelf-spacer"
      aria-hidden
      style={{
        flex: grow ? '1 0 auto' : '0 1 auto',
        [direction]: space ? spaceToSize(space) : '0',
      }}
    />
  )
}

Spacer.propTypes = {
  /* eslint-disable react/require-default-props */
  /* Default props as `undefined` would override inherited props */
  grow: PropTypes.bool,
  space: PropTypes.number,
  ofType: PropTypes.string,
  columns: PropTypes.number,
  showAboveGridWidth: PropTypes.number,
  showBelowGridWidth: PropTypes.number,
  showBetweenGridWidths: PropTypes.array,
}

Spacer.defaultProps = {
  grow: false,
  space: 0,
  showAboveGridWidth: 0,
  showBelowGridWidth: 0,
  showBetweenGridWidths: [0, 0],
  ofType: 'Column',
}

export { Shelf, Spacer }
