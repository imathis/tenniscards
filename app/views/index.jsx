import React from 'react'
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { MessageProvider } from '@level'

import { Main } from '@app/layouts/Main'
import { ThemeProvider } from '@app/hooks/useTheme'
import { DeckIndex } from './deck'
import { Card } from './deck/card'

const Welcome = () => (
  <h1>Welcome</h1>
)

const NotFound = () => (
  <h4>Not Found</h4>
)

const AppIndex = () => (
  <Routes>
    <Route path="/" element={<ThemeProvider><Main /></ThemeProvider>}>
      <Route index element={<Navigate to="welcome" />} />
      <Route path="welcome" element={<Welcome />} />
      <Route path="deck/*" element={<DeckIndex />} />
      <Route path="card/:cardId" element={<Card />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
)

export {
  AppIndex,
}
