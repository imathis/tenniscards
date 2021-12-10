import React from 'react'

const getOffsetTop = (el) => {
  // Loop up the DOM
  if (el.offsetParent) {
    return el.offsetTop + getOffsetTop(el.offsetParent)
  }

  // Return our distance
  return el.offsetTop < 0 ? 0 : el.offsetTop
}

const getPaddingBottom = (el) => Number(window.getComputedStyle(el).getPropertyValue('padding-bottom').replace('px', ''))

const getOffsetPaddingBottom = (el) => {
  const padding = getPaddingBottom(el)
  if (el.parentElement) {
    return padding + getOffsetPaddingBottom(el.parentElement)
  }

  return padding
}

const getMaxHeight = (el) => {
  // Get vertical position of this element
  const offsetTop = getOffsetTop(el)
  const parentPadding = getOffsetPaddingBottom(el.parentElement)
  return `calc(100vh - ${offsetTop + parentPadding}px)`
}

const useMaxHeight = (props = {}) => {
  const ref = props?.ref || React.useRef()
  const [style, setStyle] = React.useState({})

  React.useEffect(() => {
    if (ref.current) {
      const maxHeight = getMaxHeight(ref.current)
      setStyle({ height: maxHeight })
    }
  }, [ref.current])

  return { style, ref }
}

export { useMaxHeight }
