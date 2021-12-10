import React from 'react'
import { Stack } from '../Stack'
import { useKeyDown, useToast } from '../../hooks'

import './toast.scss'

import { ToastMessage } from './Message'

const ToastIndex = () => {
  const [toasts, setToasts] = React.useState([])
  const { subscribe, clear } = useToast()
  const newToast = subscribe()
  const esc = useKeyDown({ key: 'Escape', stopPropagation: !!toasts.length })

  React.useEffect(() => {
    if (newToast) {
      // Add latest toast to the rendering index
      setToasts((t) => [newToast].concat(t))
      // Pop the toast from the published list
      clear()
    }
  }, [newToast])

  // When escape is clicked, walk backwards through the toasts
  // and dismiss them one at a time
  React.useEffect(() => {
    if (esc) {
      let count = 1
      setToasts((all) => all.reverse().map((t) => {
        if (!t.escaped && count) {
          count -= 1
          return { ...t, escaped: true }
        }
        return t
      }).reverse())
    }
  }, [esc])

  // Match a toasts uuid to remove it from the index
  const remove = React.useCallback((uuid) => {
    setToasts((all) => all.filter((t) => t.uuid !== uuid))
  }, [])

  if (toasts.length === 0) return null

  return (
    <Stack className="level-toast-index" space={5}>
      { toasts.map((toast, index) => (
        <ToastMessage
          key={toast.uuid}
          remove={() => remove(toast.uuid)}
          index={index}
          {...toast}
        />
      )) }
    </Stack>
  )
}

export {
  ToastIndex,
  ToastMessage,
}
