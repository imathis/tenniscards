import React from 'react'

// ## Set a state which reverts to null after a specified period ##
//
// `timeout` - required - the number of milliseconds before the state should revert to null
// `initialState` - optional - if set, it will initiate the countdown immediately
// `after` - optional - a callback to be triggered when the state countdown completes
//
// This is especially useful for animation timers, when you want to set a state property
// which controlls an animation, but should be disabled after the animation completes.
//
// Returns an array including a state variable, and a state setter.
//
// If you have an appearance animation, you could set an initialState, and then use the
// decaying state variable right away.
//
// If you have a disappearing animation after which you want to trigger a callback for removing
// a component, you would not set an initial state, then trigger the `setState` to begin
// hooking up the removal to the after callback option.
const useTimeoutState = ({
  timeout,
  state: initialState = null,
  after = null,
}) => {
  const [timeoutState, setTimeoutState] = React.useState(initialState)
  const handle = React.useRef()

  const startTimeout = React.useCallback(() => {
    handle.current = window.setTimeout(() => {
      setTimeoutState(null)
      if (after) after()
    }, timeout)
  }, [timeout, after])

  // Set the state and start the decay timer
  const setState = React.useCallback((state = true) => {
    window.clearTimeout(handle.current)
    setTimeoutState(state)
    startTimeout()
  }, [])

  // Trigger the timeout if an initial state was set
  // and cleanup the timeout if the component is unmounted.
  React.useEffect(() => {
    if (initialState !== null) startTimeout()
    return () => {
      window.clearTimeout(handle.current)
    }
  }, [])

  // Returns the current state (null unless set) and a state setter
  return [timeoutState, setState]
}

export { useTimeoutState }
