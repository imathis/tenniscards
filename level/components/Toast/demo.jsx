import React from 'react'
import { useToast } from '../../hooks'
import { Button } from '../Button'
import { Shelf } from '../Shelf'

// Just here for future docs demo purposes.
const ToastDemo = () => {
  const {
    sendSuccess,
    sendError,
    sendProcessing,
    sendWarning,
    sendSystemUpdate,
  } = useToast()

  const testObj = { message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam.' }
  return (
    <Shelf space={4} style={{ position: 'absolute', zIndex: 2 }}>
      <Button text="success" onClick={() => sendSuccess(testObj)} type="button" />
      <Button text="warning" onClick={() => sendWarning(testObj)} type="button" />
      <Button text="error" onClick={() => sendError(testObj)} type="button" />
      <Button text="system" onClick={() => sendSystemUpdate(testObj)} type="button" />
      <Button text="progress" onClick={() => sendProcessing(testObj)} type="button" />
    </Shelf>
  )
}

export {
  ToastDemo,
}
