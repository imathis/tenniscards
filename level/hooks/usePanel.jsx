import React from 'react'

const usePanel = (props = {}, refreshProp) => {
  let refresh = refreshProp || []
  let refs = props

  // Passing props object is optional, if not passed, accept refresh prop as first positional arg
  if (!refreshProp && Array.isArray(props)) {
    refresh = refreshProp
    refs = {}
  }

  const contentRef = refs.contentRef || React.useRef()
  const footerRef = refs.footerRef || React.useRef()
  const [style, setStyle] = React.useState({})

  // Layout measurements to ensure the drawer content is full height
  // This lets it scroll, keeping the header and footer fixed
  React.useLayoutEffect(() => {
    const footerHeight = (footerRef.current) ? footerRef.current?.clientHeight || 0 : 0
    if (contentRef.current) {
      setStyle({
        overflowY: 'auto',
        height: `calc(100vh - ${contentRef.current.getBoundingClientRect().top}px - ${footerHeight}px)`,
      })
    }
  }, [contentRef.current, footerRef.current, ...refresh])

  return {
    contentStyle: style,
    contentRef,
    footerRef,
  }
}

export {
  usePanel,
}
