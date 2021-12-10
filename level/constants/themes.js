const themes = {
  default: { color: 'inherit', tag: 'span' },
  helpText: { color: 'gray-500', tag: 'p' },
}

// Assign text sizes for tags from fontSize constant
const tagSizes = {
  h1: 6, h2: 5, h3: 4, h4: 3, h5: 'default', h6: 1, small: 0, p: 'default',
}

module.exports = {
  themes,
  tagSizes,
}
