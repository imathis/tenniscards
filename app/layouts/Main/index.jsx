import React from 'react'
import {
  Outlet,
} from 'react-router-dom'

import './layout.scss'
import { useTheme } from '@app/hooks/useTheme'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

const Main = () => {
  const { theme } = useTheme()
  return (
    <div id="main">
      <Outlet />
      <div className="shade default" />
      <TransitionGroup component={null}>
        { ['black', 'red', 'purple'].map((color) => (theme === color ? (
          <CSSTransition
            key={color}
            timeout={{
              appear: 100,
              exit: 100,
            }}
            classNames="shade"
          >
            <div className={`shade ${color}`} />
          </CSSTransition>
        ) : null))}
      </TransitionGroup>
    </div>
  )
}

export {
  Main,
}
