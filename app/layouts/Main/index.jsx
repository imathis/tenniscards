import React from 'react'
import {
  Outlet,
} from 'react-router-dom'

import { Link } from '@level'
import './layout.scss'

const Main = () => (
  <div id="main">
    <nav id="menu">
      <Link to="welcome" text="Welcome" />
      <Link to="deck/new" text="New Game" />
      <Link to="card" text="Card" />
    </nav>
    <Outlet />
    <div className="shade default" />
    <div className="shade black" />
    <div className="shade red" />
  </div>
)

export {
  Main,
}
