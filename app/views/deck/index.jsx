import React from 'react'
import {
  Routes,
  Route,
} from 'react-router-dom'

import { DeckProvider } from '@app/hooks/useDeck'
import { NewDeck } from './new'
import { Settings } from './settings'
import { Draw } from './draw'
import { Start } from './start'
import { Drawn } from './drawn'

const DeckIndex = () => (
  <Routes>
    <Route path="new" element={<NewDeck />} />
    <Route path=":deckId/*" element={<DeckProvider />}>
      <Route index element={<Start />} />
      <Route path="settings" element={<Settings />} />
      <Route path="start" element={<Start />} />
      <Route path="draw" element={<Draw />} />
      <Route path="drawn" element={<Drawn />} />
    </Route>
  </Routes>
)

export {
  DeckIndex,
}
