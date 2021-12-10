import React from 'react'
import { uuid } from './useUuid'
import { usePubSub } from './usePubSub'

const MessageContext = React.createContext()

const MessageProvider = ({ children }) => {
  const {
    subscribe,
    publish,
  } = usePubSub()

  return (
    <MessageContext.Provider value={{ subscribe, publish }}>
      { children }
    </MessageContext.Provider>
  )
}

const useMessages = ({ channel }) => {
  const { publish: send, subscribe: watch } = React.useContext(MessageContext)

  const publish = React.useCallback((state) => {
    send({ channel, state: { uuid: uuid(), ...state } })
  }, [])

  const clear = React.useCallback(() => {
    send({ channel, state: null })
  }, [])

  const subscribe = () => watch(channel)

  return { publish, subscribe, clear }
}

export {
  MessageProvider,
  useMessages,
}
