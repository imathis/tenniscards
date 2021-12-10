import React from 'react'
import PropTypes from 'prop-types'
import { Stack } from '../Stack'

import './progress.scss'

const ProgressBar = ({
  progress,
  total,
  message,
  status,
}) => {
  const width = `${((progress / total) * 100) || 0}%`

  return (
    <Stack space={3}>
      <div className="level-progress-bar" data-status={status}>
        <div className="level-progress-amount" style={{ width }} />
      </div>
      { message ? <div className="level-progress-text" data-status={status}>{message}</div> : null }
    </Stack>
  )
}

ProgressBar.propTypes = {
  progress: PropTypes.number,
  message: PropTypes.string,
  status: PropTypes.string,
  total: PropTypes.number,
}

ProgressBar.defaultProps = {
  message: 'Processing',
  progress: 0,
  status: '',
  total: 100,
}

export { ProgressBar }
