import React from 'react'
import ReactDOM from 'react-dom'

import {
  BrowserRouter,
} from 'react-router-dom'

import './index.scss'
import '@app/assets/favicons/favicons'
import '@app/assets/cards/cards'
import { AppIndex } from '@app/views/index'

ReactDOM.render(
  <BrowserRouter>
    <AppIndex />
  </BrowserRouter>,
  document.getElementById('app'),
)
