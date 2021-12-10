import React from 'react'
import PropTypes from 'prop-types'
import { uuid } from './useUuid'

const usePubSub = () => {
  // subscribers: [{ handle, channel }]
  const [subscribers, setSubscribers] = React.useState([])
  // channels: { channelName: state, … }
  const [channels, setChannels] = React.useState({})

  const unSubscribe = React.useCallback((handle) => {
    setSubscribers((subs) => subs.filter((s) => s.handle === handle))
  }, [])

  const subscribe = (channel) => {
    React.useEffect(() => {
      const handle = uuid()
      setSubscribers((subs) => ([...subs, { handle, channel }]))
      return () => { unSubscribe(handle) }
    }, [channel, uuid])

    return typeof channels[channel] !== 'undefined' ? channels[channel] : null
  }

  // Accepts an object { channel, state } or an array [{ channel, state }]
  const publish = React.useCallback((args) => {
    const channelUpdates = Array.isArray(args) ? args : [args]
    // Converts array of [{ channel, state }] => { [channel]: state, [channel2]: state2 }
    const updates = channelUpdates.reduce((all, { channel, state }) => (
      { ...all, [channel]: state }
    ), {})

    // Merge updates over current channel state
    setChannels((ch) => ({ ...ch, ...updates }))
  }, [])

  const channelSubscribers = React.useCallback((channel) => (
    subscribers.filter((sub) => sub.channel === channel)
  ), [subscribers])

  const useStateChannel = React.useCallback((channel) => {
    const data = subscribe(channel)

    // setData behaves like a React.useState callback.
    // If passed a function, it passes the current state as an argument and executes to set state
    // If passed anything but a function it publishes to the channel.
    const setData = (state) => {
      const newState = (typeof state === 'function') ? state(data) : state
      publish({ channel, state: newState })
    }

    return [data, setData]
  }, [channels])

  return {
    publish,
    channels,
    subscribe,
    subscribers,
    useStateChannel,
    channelSubscribers,
  }
}

const PubSubProvider = ({ children, context }) => {
  const hooks = usePubSub()
  return (
    <context.Provider value={{ ...hooks }}>
      { children }
    </context.Provider>
  )
}

PubSubProvider.propTypes = {
  children: PropTypes.node.isRequired,
  context: PropTypes.shape({
    Provider: PropTypes.object.isRequired,
  }).isRequired,
}

export { usePubSub, PubSubProvider }
