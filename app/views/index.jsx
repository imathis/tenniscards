import React from 'react'
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { MessageProvider } from '@level'

import { Main } from '@app/layouts/Main'
import { DeckIndex } from './deck'

const Welcome = () => (
  <h1>Welcome</h1>
)

const NotFound = () => (
  <h4>Not Found</h4>
)

const AppIndex = () => (
  <Routes>
    <Route path="/" element={<Main />}>
      <Route index element={<Navigate to="welcome" />} />
      <Route path="welcome" element={<Welcome />} />
      <Route path="deck/*" element={<DeckIndex />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
)

export {
  AppIndex,
}
