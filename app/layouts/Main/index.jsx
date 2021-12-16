import React from 'react'
import {
  Outlet,
} from 'react-router-dom'

import { Link } from '@level'
import './layout.scss'
import { useTheme } from '@app/hooks/useTheme'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

const Main = () => {
  const { theme } = useTheme()
  return (
    <div id="main">
      <nav id="menu">
        <Link to="welcome" text="Welcome" />
        <Link to="deck/new" text="New Game" />
        <Link to="card" text="Card" />
      </nav>
      <Outlet />
      <div className="shade default" />
      <TransitionGroup component={null}>
        { ['black', 'red', 'purple'].map((color) => (theme === color ? (
          <CSSTransition key={color} timeout={100} classNames="shade">
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
