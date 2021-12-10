import React from 'react'
import PropTypes from 'prop-types'
import { spaceToSize, isOfType } from '../../helpers'
import { Grid } from '../Grid'
import { Column } from '../Column'

const Stack = React.forwardRef(({
  space,
  children,
  align,
  valign,
  shrink,
  reverse,
  aria,
  gridTag,
  columnTag,
  role,
  className,
  style,
  ...rest
}, ref) => (
  <Grid
    bottomSpace={space}
    valign={align}
    align={valign}
    shrink={shrink}
    columns={1}
    reverse={reverse}
    aria={aria}
    gridTag={gridTag}
    columnTag={columnTag}
    role={role}
    ref={ref}
    className={className}
    style={style}
    {...rest}
  >
    {React.Children.map(children, (child) => {
      if (!child || isOfType(child, 'Column')) return child
      return <Column>{child}</Column>
    })}
  </Grid>
))

Stack.propTypes = {
  align: PropTypes.string,
  valign: PropTypes.string,
  shrink: PropTypes.bool,
  reverse: PropTypes.bool,
  aria: PropTypes.object,
  gridTag: PropTypes.string,
  columnTag: PropTypes.string,
  role: PropTypes.string,
  className: PropTypes.string,
  space: spaceToSize.propTypes.space,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array]).isRequired,
  style: PropTypes.object,
}

Stack.defaultProps = {
  space: 0,
  className: undefined,
  align: undefined,
  valign: undefined,
  shrink: undefined,
  reverse: undefined,
  aria: undefined,
  gridTag: undefined,
  columnTag: undefined,
  role: undefined,
  style: {},
}

export { Stack }
