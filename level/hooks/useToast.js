import React from 'react'
import { useMessages } from './useMessages'

// Defaults for the five different toast message types
//
// timeout: in ms, when a message should auto-dismiss
// replace: bool, should a message be dismissed when replaced?
const toastDefaults = {
  success: {
    title: 'Success',
    icon: 'check-circle',
    timeout: 2500,
  },
  warning: {
    title: 'Warning',
    icon: 'exclamation-triangle',
    timeout: 2500,
    replace: true,
  },
  error: {
    title: 'Error',
    icon: 'x-circle',
    replace: true,
  },
  systemUpdate: {
    title: 'System update',
    icon: 'logo-icon',
  },
  processing: {
    title: 'Processing',
    icon: 'three-dots-horizontal',
    replace: true,
    delay: 400,
  },
}

// Wraps the useMessages pubsub with some guard-rails for sending toast type messages
const useToast = () => {
  const { publish, subscribe, clear } = useMessages({ channel: 'toast' })

  // This makes it easy to accept props as an object or a string and merge it properly
  const send = React.useCallback(({ type, props }) => {
    const defaultProps = { ...toastDefaults[type], type }
    if (typeof props === 'string') publish({ ...defaultProps, message: props })
    else if (typeof props === 'object') publish({ ...defaultProps, ...props })
    else publish(defaultProps)
  }, [])

  // These are helper functions to set type, defaults, and overrides.
  const sendSuccess = React.useCallback((props) => {
    send({ type: 'success', props })
  }, [])
  const sendError = React.useCallback((props) => {
    send({ type: 'error', props })
  }, [])
  const sendProcessing = React.useCallback((props) => {
    send({ type: 'processing', props })
  }, [])
  const sendWarning = React.useCallback((props) => {
    send({ type: 'warning', props })
  }, [])
  const sendSystemUpdate = React.useCallback((props) => {
    send({ type: 'systemUpdate', props })
  }, [])

  return {
    clear,
    subscribe,
    sendError,
    sendSuccess,
    sendWarning,
    sendProcessing,
    sendSystemUpdate,
  }
}

export {
  useToast,
  toastDefaults,
}
