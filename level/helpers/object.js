import { dasherize } from './text'

// Return an object where only the included keys are present
const filterKeys = (obj, includedKeys) => (
  Object.keys(obj).reduce((all, key) => (
    (includedKeys.includes(key)) ? { ...all, [key]: obj[key] } : all
  ), {})
)

const excludeKeys = (obj, excludedKeys) => (
  Object.keys(obj).reduce((all, key) => (
    (excludedKeys.includes(key)) ? all : { ...all, [key]: obj[key] }
  ), {})
)

// Filter all non-truthy values from an object.
// If `forKeys` is set, only filter non-truthy values on those keys
const filterTruthyValues = (obj, forKeys) => (
  Object.keys(obj).reduce((all, key) => (
    // Value is truthy or there are key selections and this isn't one of them
    (!!obj[key] || (forKeys && !forKeys.includes(key))) ? { ...all, [key]: obj[key] } : all
  ), {})
)

const toSearchString = (obj) => {
  const params = new URLSearchParams()
  Object.keys(obj).forEach((key) => {
    params.append(key, obj[key])
  })
  return params.toString()
}

const searchToObject = (str) => {
  const params = new URLSearchParams(str)
  const obj = {}

  params.forEach((val, key) => {
    if (obj[key]) {
      obj[key] = Array([obj[key], val]).flat()
    } else obj[key] = val
  })

  return obj
}

const isEqual = (obj1, obj2) => {
  if (!obj1 || !obj2) return false
  const props1 = Object.getOwnPropertyNames(obj1)
  const props2 = Object.getOwnPropertyNames(obj2)
  if (props1.length !== props2.length) {
    return false
  }
  for (let i = 0; i < props1.length; i += 1) {
    const prop = props1[i]
    const bothAreObjects = (
      typeof (obj1[prop]) === 'object'
      && typeof (obj2[prop]) === 'object'
      && obj1[prop] && obj2[prop]
    )
    if ((!bothAreObjects && (obj1[prop] !== obj2[prop]))
    || (bothAreObjects && !isEqual(obj1[prop], obj2[prop]))) {
      return false
    }
  }
  return true
}

const expandAria = (aria) => {
  const obj = {}

  if (aria) {
    Object.keys(aria).forEach((key) => {
      obj[`aria-${dasherize(key)}`] = aria[key]
    })
  }
  return obj
}

export { }

export {
  isEqual,
  filterKeys,
  excludeKeys,
  filterTruthyValues,
  toSearchString,
  searchToObject,
  expandAria, 
}
