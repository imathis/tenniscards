import React from 'react'
import { useDebouncedUiCallback } from './useDebouncedCallback'

const excludeTargets = ['input', 'textarea', 'select', 'button', '[contenteditable]', 'a', '[role=button]']

// Ensure that a key and its modifiers (if any) are present
// Examples:
// - "Enter" requires that the enter key was pressed (with no modifiers)
// - "Shift Enter" requires Enter and the Shift key to have been pressed
// - "Cmd Shift Enter" requires all three keys (but not ctrl)
const matchesKey = (key, event) => (
  key.split(' ').slice(-1)[0] === event.key
    && event.shiftKey === !!key.match(/shift/i)
    && event.ctrlKey === !!key.match(/ctrl/i)
    && event.metaKey === !!key.match(/cmd/i)
)

// Determine if a keypress can trigger a shortcut, It must
// - Either match a selector `match`, or not match excluded selectors
// - And the key(s) must match (including modifiers)
const keyPressed = ({
  event,
  key,
  match = [],
  exclude = excludeTargets,
}) => {
  const matches = Array.isArray(match) ? match : [match]
  const excluding = exclude.filter((m) => !matches.includes(m))
  const keys = Array.isArray(key) ? key : [key]
  return (
    // Keys match the correct combination
    keys.find((k) => matchesKey(k, event))
    && (
      // Target either matches the provides selector or
      matches.find((i) => event.target.matches(i))
      // target does not match an excluded selector
      || !excluding.find((i) => event.target.matches(i))
    )
  )
}

// Accepts one or more keys to match (including modifiers)
//
// Example Input:
// - "ArrowDown"
// - ["ArrowDown", "Enter"]
// - ["ArrowUp", "Shift Enter"]
//
// Returns a counter (state variable) which changes each time a chosen key was pressed.
// This counter resets after 10 ms by default, but you can override that if necessary.
//
// Note: If you need to trigger a function, use the useEffect, passing count as a dependency
//
const useKeyPress = ({
  key, eventType, match, exclude, resetAfter = 10, stopPropagation = false,
}) => {
  // Create a state counter to track the number of keyup
  const [count, setCount] = React.useState(0)

  const increment = useDebouncedUiCallback(() => {
    setCount((c) => c + 1)
  }, 80)

  const handler = React.useCallback((event) => {
    if (keyPressed({
      event, key, match, exclude,
    })) {
      increment()
      event.preventDefault()
      if (stopPropagation) event.stopPropagation()
    }
  }, [key, match, exclude, stopPropagation])

  React.useEffect(() => {
    window.addEventListener(eventType, handler, { capture: stopPropagation })
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener(eventType, handler, { capture: stopPropagation })
    }
  }, [handler])

  React.useEffect(() => {
    let timeoutHandle = null
    if (resetAfter) {
      timeoutHandle = window.setTimeout(() => setCount(0), resetAfter)
    }
    return () => window.clearTimeout(timeoutHandle)
  }, [count])

  return count
}

const useKeyDown = ({ exclude = excludeTargets, ...rest }) => useKeyPress({ eventType: 'keydown', exclude, ...rest })
const useKeyUp = ({ exclude = excludeTargets, ...rest }) => useKeyPress({ eventType: 'keyup', exclude, ...rest })

export { useKeyDown, useKeyUp }
