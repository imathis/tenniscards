import React from 'react'
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { DeckProvider } from '@app/hooks/useDeck'
import { NewDeck } from './new'
import { Settings } from './settings'
import { Draw } from './draw'
import { Start } from './start'

const DeckIndex = () => (
  <Routes>
    <Route path="new" element={<NewDeck />} />
    <Route path=":deckId/*" element={<DeckProvider />}>
      <Route index element={<Start />} />
      <Route path="settings" element={<Settings />} />
      <Route path="draw" element={<Draw />} />
    </Route>
  </Routes>
)

export {
  DeckIndex,
}
