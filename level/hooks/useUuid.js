import React from 'react'

const uuid = () => (
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16)
    const v = c === 'x' ? r : ((r & 0x3) | 0x8)
    return v.toString(16)
  })
)

const Dependencies = []

// This will generate a unique ID the first time it is called
// and then generate a new one, only if the dependencies change
const useUuid = (dependencies = Dependencies) => {
  // initialize to null
  const [id, setId] = React.useState(null)

  // Only generate if id === null
  const unique = id ? null : uuid()

  React.useEffect(() => {
    // The first time, ID should be null so it will use unique
    // If a dependency changes, this will be rendering a second time
    // and id will not be null, so it will generate a new UUID
    setId((i) => (!i ? unique : uuid()))
  }, dependencies)

  return id || unique
}

export { useUuid, uuid }
