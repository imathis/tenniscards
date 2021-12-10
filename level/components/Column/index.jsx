import React from 'react'
import PropTypes from 'prop-types'
import { spaceToSize, expandAria } from '../../helpers'

// Calculate margin from space props
const getMargin = ({
  space, bottomSpace, align, valign,
}) => {
  const spaceSize = space !== '0px' ? `calc(${space} / 2)` : 0
  return {
    marginTop: (valign === 'bottom' || valign === 'center') ? 'auto' : 0,
    marginLeft: (align === 'right' || align === 'center') ? 'auto' : spaceSize,
    marginRight: (align === 'left' || align === 'center') ? 'auto' : spaceSize,
    marginBottom: (valign === 'top' || valign === 'center') ? 'auto' : bottomSpace,
  }
}

// Calculate flex styles to handle percentage widths const getFlex = ({
const getFlex = ({
  columns, span, space, grow, shrink, width,
}) => {
  // Calculate flexBasis as a percentange of columns (minus space)
  let flexBasis = null
  if (!width) {
    flexBasis = `${((span || 1) / columns) * 100}%`
    if (space) flexBasis = `calc(${flexBasis} - ${space})`
    if (shrink && !grow) flexBasis = 'auto'
  }

  const flexGrow = grow ? 1 : 0
  const flexShrink = (shrink && !grow) ? 1 : 0
  return { flexGrow, flexShrink, flexBasis }
}

// Returns a style object with margin, width, and flex properties derived from props
const columnStyle = (props) => {
  const {
    columns,
    span,
    grow,
    shrink,
    align,
    valign,
    width: propsWidth,
  } = props

  // Transform from 0 => '0px' or 4 => '12px'
  const { space, bottomSpace = space } = spaceToSize(props)
  const margin = getMargin({
    space, bottomSpace, align, valign,
  })

  // If it is full width (a single columns, with shrink == false)
  // Calculate width acounting for space.
  const fullWidth = (space && space !== '0px') ? `calc(100% - ${space})` : '100%'
  const width = (columns === 1 && !shrink) ? fullWidth : propsWidth

  // If not fullWidth calculate flex properties
  const flex = getFlex({
    columns, span, space, grow, shrink, width,
  })

  return {
    ...margin, ...flex, width,
  }
}

const Column = ({
  columns,
  span,
  space,
  bottomSpace,
  grow,
  shrink,
  align,
  valign,
  children,
  role,
  aria,
  style: propsStyle,
  tag: Tag = 'div',
  className,
  id,
  width,
  showAboveGridWidth,
  showBelowGridWidth,
  showBetweenGridWidths,
  ofType,
  ...props
}) => {
  const style = React.useMemo(() => columnStyle({
    columns, span, space, bottomSpace, grow, shrink, align, valign, width,
  }), [columns, span, space, bottomSpace, grow, shrink, align, valign, width])

  return (
    <Tag
      {...expandAria(aria)}
      role={role}
      className={`level-column ${className || ''}`}
      id={id}
      style={{ ...style, ...propsStyle }}
      {...props}
    >
      {children}
    </Tag>
  )
}

Column.propTypes = {
  /* eslint-disable react/require-default-props */
  /* Default props as `undefined` would override inherited props */
  columns: PropTypes.number,
  grow: PropTypes.bool,
  shrink: PropTypes.bool,
  span: PropTypes.number,
  bottomSpace: spaceToSize.propTypes.space,
  space: spaceToSize.propTypes.space,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
  showAboveGridWidth: PropTypes.number,
  showBelowGridWidth: PropTypes.number,
  showBetweenGridWidths: PropTypes.array,
  aria: PropTypes.object,
  role: PropTypes.string,
  tag: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right', undefined]),
  valign: PropTypes.oneOf(['top', 'center', 'bottom', undefined]),
  className: PropTypes.string,
  id: PropTypes.string,
  style: PropTypes.object,
  ofType: PropTypes.string,
  width: PropTypes.string,
}

Column.defaultProps = {
  showAboveGridWidth: 0,
  showBelowGridWidth: 0,
  showBetweenGridWidths: [0, 0],
  style: {},
  className: null,
  id: null,
  ofType: 'Column',
}

export { Column }
