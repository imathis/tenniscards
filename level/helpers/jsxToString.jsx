import React from 'react'
import { renderToString } from 'react-dom/server'

// Wrap react-dom render because it appends attributes to the root element
// This creates a placeholder root and removes it
const jsxToString = (element) => (
  renderToString(<p>{element}</p>).replace(/^<p.+?>/, '').replace(/<\/p>$/, '')
)

export { jsxToString }
