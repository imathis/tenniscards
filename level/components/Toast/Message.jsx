import React from 'react'
import PropTypes from 'prop-types'

import { Grid } from '../Grid'
import { Column } from '../Column'
import { Icon } from '../Icon'
import { Text, P } from '../Text'
import { Button } from '../Button'
import { Stack } from '../Stack'

import { useTimeoutState } from '../../hooks'

const ToastMessage = ({
  type,
  message,
  title,
  icon,
  remove,
  index: propsIndex,
  timeout,
  replace,
  escaped,
  delay,
}) => {
  // Sync timeouts with animation length (ms)
  const delayTime = delay || 0
  const animationLength = 250
  const [index, setIndex] = React.useState(propsIndex)
  const handle = React.useRef()

  // Hide toast until delay timer elapses. If no delay is set, delayed state will be false.
  const [delayed] = useTimeoutState({ timeout: delayTime, state: !!delay })
  // Animation states for when a toast message is freshly added or being dismissed
  const [arriving] = useTimeoutState({ timeout: animationLength + delayTime, state: true })
  const [dismissing, dismiss] = useTimeoutState({ timeout: animationLength, after: remove })

  // Animation states for sliding down or up when other toasts are added/removed to index.
  // Adding: when a new toast is appearing above this toast
  const [adding, setAdding] = useTimeoutState({ timeout: animationLength })
  // Removing: when a toast is being dismissed above this toast
  const [removing, setRemoving] = useTimeoutState({ timeout: animationLength })

  // Remove if escape key has triggered removal
  // This is set by a watcher from the index to help control dismissal order
  React.useEffect(() => {
    if (escaped && delayed) remove()
    else if (escaped && !dismissing) dismiss()
  }, [escaped])

  // Automatically dismiss when timeoutAfter elapses
  React.useLayoutEffect(() => {
    if (timeout) handle.current = window.setTimeout(dismiss, timeout + animationLength)
  }, [])

  // Cleanup timeouts to avoid memory leaks on unmount
  React.useEffect(() => () => window.clearTimeout(handle.current), [])

  React.useLayoutEffect(() => {
    // If the index has increased (A toast has been added above this one)
    if (index < propsIndex) {
      setAdding()
      // If toast should be replaced when another is added, begin that process.
      if (replace) {
        // Immediately remove if delayed (curently invisible)
        if (delayed) remove()
        else dismiss()
      }
    // If the index has reduced (A toast above this one has been removed)
    // Trigger removal animation property to slide this message upward
    } else if (propsIndex < index) setRemoving()

    // Keep index up to date so we can keep comparing
    setIndex(propsIndex)
  }, [propsIndex, index])

  // If delayed, do not render a toast.
  if (delayed) return null

  return (
    <div
      className="level-toast"
      data-type={type}
      // Animation state properties
      data-arriving={arriving}
      data-dismissing={dismissing}
      data-adding={adding}
      data-removing={removing}
    >
      <Button
        onClick={() => dismiss()}
        className="level-toast-dismiss"
        theme="ghost"
        type="button"
        icon={{ name: 'x-light', size: 4 }}
        label="dismiss"
      />
      <Grid space={6}>
        <Column shrink>
          <Icon size={5} name={icon} />
        </Column>
        <Column grow>
          <Stack space={3} className="level-toast-content">
            <Text className="level-toast-title" tag="h5">{ title }</Text>
            <P className="level-toast-message">{ message }</P>
          </Stack>
        </Column>
      </Grid>
    </div>
  )
}

ToastMessage.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  icon: PropTypes.string,
  remove: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  replace: PropTypes.bool,
  timeout: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  escaped: PropTypes.bool,
  delay: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
}

ToastMessage.defaultProps = {
  title: null,
  icon: null,
  replace: null,
  timeout: null,
  escaped: false,
  delay: null,
}

export { ToastMessage }
