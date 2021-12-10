import React, {
  useState, useEffect, useLayoutEffect, useRef,
} from 'react'
import PropTypes from 'prop-types'

import { useDebouncedUiCallback } from '../../hooks'

import {
  spaceToSize,
  isOfType,
  mergeProps,
  expandAria,
} from '../../helpers'

import { Column } from '../Column'

import './grid.scss'

const alignment = {
  left: 'flex-start',
  right: 'flex-end',
  center: 'center',
  split: 'space-between',
  around: 'space-around',
  reverse: 'reverse-row',
  stretch: 'stretch',
}

const valignment = {
  stretch: 'stretch',
  top: 'flex-start',
  bottom: 'flex-end',
  center: 'center',
  baseline: 'baseline',
  initial: 'initial',
}

const alignments = Object.keys(alignment)
const valignments = Object.keys(valignment)

// Calculate margin from space props
const getMargin = ({ space, bottomSpace }) => {
  const spaceSize = space !== '0px' ? `calc(-${space} / 2)` : 0
  return (spaceSize || bottomSpace !== '0px') ? `0 ${spaceSize} -${bottomSpace}` : null
}

const gridStyle = (props) => {
  const {
    align,
    valign,
    wrap,
    columns,
    reverse,
    wrapReverse,
    style,
  } = props

  // Transform from 0 => '0px' or 4 => '12px'
  const { space, bottomSpace = space } = spaceToSize(props)

  // Add negative margins to allow columns to run flush to the edges
  const margin = getMargin({ space, bottomSpace })

  if (columns) {
    let direction = columns === 1 ? 'column' : 'row'
    if (reverse) direction += '-reverse'

    let flexWrap = wrap ? 'wrap' : 'nowrap'
    if (wrapReverse) flexWrap += '-reverse'

    return {
      margin,
      display: 'flex',
      justifyContent: alignment[align],
      flexFlow: `${direction} ${flexWrap}`,
      alignItems: valignment[valign],
      ...style,
    }
  }

  return { margin }
}

const isColumnResponsive = ({ props }) => {
  if (!props) return false
  const { showAboveGridWidth, showBelowGridWidth, showBetweenGridWidths } = props
  const [rangeMin, rangeMax] = showBetweenGridWidths
  return (
    showAboveGridWidth !== 0
    || showBelowGridWidth !== 0
    || (rangeMin !== 0 && rangeMax !== 0)
  )
}

// Determine visiblity from gridWidth and responsive props
// This is on the Grid component to be evaluated each time a grid changes size.
const showColumn = ({
  showAboveGridWidth: above,
  showBelowGridWidth: below,
  showBetweenGridWidths: between,
  ofType,
}, gridWidth) => {
  // Extract to shorthand properties
  const [rangeMin, rangeMax] = between

  // Guards
  if (ofType !== 'Column') return false
  if (!gridWidth) return true // If grid has no measured width allow all

  const aboveWidth = above < gridWidth
  const belowWidth = gridWidth < below || !below
  const inRange = rangeMin < gridWidth && (gridWidth < rangeMax || rangeMax === 0)

  // Hide columns unless they're outside a range ✓✓✓✓✓max[    ]min✓✓✓✓✓
  // Example: { showBelow: 100, showAbove: 300 }
  if (below && below < above) return aboveWidth || belowWidth

  // Should be between min[✓✓✓✓✓]max
  return aboveWidth && belowWidth && inRange
}

const getVisibleColumns = ({ children, gridWidth }) => (
  React.Children.toArray(children).filter((child) => (
    child.props && showColumn(child.props, gridWidth)
  ))
)

const calcColumns = ({
  space, columns, columnMin, gridMin, gridWidth,
}) => {
  // If narrower than grid minimum, set all columns to full width.
  if (gridMin && gridWidth < gridMin) return 1

  if (columnMin && gridWidth) {
    // How many min sized columns (with space) will fit within the current width?
    const willFit = Math.floor(gridWidth / (columnMin + Number.parseInt(spaceToSize(space), 10)))

    // If there is a column minimum size, set the column number to ensure
    if (willFit < columns) return willFit
  }

  return columns
}

const Grid = React.forwardRef(({
  columnMin,
  gridMin,
  shrink,
  grow,
  align,
  valign,
  reverse,
  wrap,
  space,
  role,
  aria,
  bottomSpace,
  gridTag: Tag,
  columnTag,
  children: gridChildren,
  className,
  style: propsStyle,
  wrapReverse = (wrap && reverse),
  columns: propColumns = React.Children.count(gridChildren),
  ...rest
}, ref) => {
  const [gridWidth, setGridWidth] = useState(0)

  const children = React.useMemo(() => (
    React.Children.map(gridChildren, (child) => (
      // If child is not wrapped in a coulumn, wrap it.
      (!child || isOfType(child, 'Column'))
        ? child
        : <Column>{child}</Column>
    ))
  ), [gridChildren])

  // Determine if any column children have responsive hide/show properties
  const hasResponsiveColumns = React.useMemo(() => {
    let isResponsive = false
    React.Children.forEach(children, (child) => {
      isResponsive = isResponsive || (child?.props && isColumnResponsive(child))
    })
    return isResponsive
  }, [children])

  // Default columns to number of children, but allow to be changed for responsive grid
  const isResponsive = !!(gridMin || columnMin || hasResponsiveColumns)

  // Memoize which columns are visible (if there are responsive columns)
  const visibleColumns = React.useMemo(() => (
    hasResponsiveColumns ? getVisibleColumns({ children, gridWidth }) : children
  ), [children, gridWidth])

  // If the grid is responsive, calculate the correct number of columns divisions
  const columns = React.useMemo(() => (
    !isResponsive ? propColumns : calcColumns({
      space, columnMin, gridMin, gridWidth, columns: propColumns || visibleColumns.length,
    })
  ), [space, columnMin, gridMin, gridWidth, propColumns, visibleColumns.length])

  // Memoize the cloned children
  const columnChildren = React.useMemo(() => (
    React.Children.map(
      visibleColumns,
      (column) => mergeProps(column, {
        columns,
        space,
        bottomSpace,
        shrink,
        grow,
        tag: columnTag,
      }),
    )
  ), [visibleColumns, columns, space, bottomSpace, shrink, grow, columnTag])

  const style = Object.assign(gridStyle({
    space,
    bottomSpace,
    align,
    valign,
    wrap,
    columns,
    reverse,
    wrapReverse,
    style: propsStyle,
  }), {})

  const gridEl = ref || useRef()

  const scaleGrid = useDebouncedUiCallback(() => {
    setGridWidth(gridEl.current.clientWidth)
  }, 200, [])

  // Ensure grid width is set before render
  useLayoutEffect(() => {
    if (isResponsive) setGridWidth(gridEl.current.clientWidth)
  }, [isResponsive])

  useEffect(() => {
    if (isResponsive) window.addEventListener('resize', scaleGrid)
    return () => window.removeEventListener('resize', scaleGrid)
  }, [isResponsive])

  return (
    <Tag
      className={`level-grid${className ? ` ${className}` : ''}`}
      style={style}
      role={role}
      ref={gridEl}
      {...expandAria(aria)}
      {...rest}
    >
      {columnChildren}
    </Tag>
  )
})

Grid.propTypes = {
  columns: PropTypes.number,
  align: PropTypes.oneOf(alignments),
  valign: PropTypes.oneOf(valignments),
  wrap: PropTypes.bool,
  columnMin: PropTypes.number,
  gridMin: PropTypes.number,
  grow: PropTypes.bool,
  shrink: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
  space: spaceToSize.propTypes.space,
  bottomSpace: spaceToSize.propTypes.space,
  reverse: PropTypes.bool,
  wrapReverse: PropTypes.bool,
  gridTag: PropTypes.string,
  columnTag: PropTypes.string,
  aria: PropTypes.object,
  role: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
}

Grid.defaultProps = {
  space: 0,
  columnMin: 0,
  gridMin: 0,
  grow: false,
  shrink: false,
  align: 'left',
  valign: 'top',
  gridTag: 'div',
  wrap: true,
  style: {},
  reverse: undefined,
  columns: undefined,
  bottomSpace: undefined,
  wrapReverse: undefined,
  columnTag: undefined,
  aria: undefined,
  role: undefined,
  className: undefined,
}

export {
  alignments,
  valignments,
  Grid,
}
