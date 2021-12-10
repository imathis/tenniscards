import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '../Button'
import { Shelf } from '../Shelf'
import { Stack } from '../Stack'
import { Text } from '../Text'
import { Input } from './Input'

import {
  isValidDate,
  addWeekDays,
} from '../../helpers'
import { useFormRef } from '../../hooks'

const dateValidation = (value) => (
  // Match pattern && ensure date is valid
  value.length === 0
  || (value.match(/^\d{4}-\d{2}-\d{2}$/) && isValidDate(value))
  || 'Date must match format: YYYY-MM-DD'
)

const DateInput = ({ addWeekdayControls, ...rest }) => {
  if (addWeekdayControls) {
    return (
      <DateAdjustments name={rest.name}>
        <DateInput {...rest} />
      </DateAdjustments>
    )
  }

  return (
    <Input
      placeholder="Date: YYYY-MM-DD"
      type="date"
      validate={dateValidation}
      {...rest}
    />
  )
}

DateInput.propTypes = {
  addWeekdayControls: PropTypes.bool,
}

DateInput.defaultProps = {
  addWeekdayControls: null,
}

const DateAdjustments = ({ name, children }) => {
  const formRef = useFormRef()

  const addDays = React.useCallback((add) => {
    const currentDate = formRef.getValues(name) || Date.now()
    const newDate = addWeekDays(currentDate, add).format('YYYY-MM-DD')
    formRef.setValue(name, newDate, { shouldDirty: true })
  }, [formRef])

  return (
    <Stack space={4}>
      { children }
      <Shelf space={4}>
        <Text size={1}>Add weekdays:</Text>
        <Button size={2} text="+5" onClick={() => addDays(5)} />
        <Button size={2} text="+10" onClick={() => addDays(10)} />
        <Button size={2} text="+15" onClick={() => addDays(15)} />
        <Button size={2} text="+20" onClick={() => addDays(20)} />
      </Shelf>
    </Stack>
  )
}

DateAdjustments.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export {
  DateInput,
}
