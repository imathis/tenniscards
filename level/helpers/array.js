// Works like classList.toggle, adding or removing an item based on its presence
const toggleArrayIncludes = (array, item) => (
  array.includes(item) ? array.filter((i) => i !== item) : [...array, item]
)

// Remove all items in `exclusions` from `base` array
const excludeItemsFromArray = (base, exclusions) => (
  base.filter((item) => !exclusions.includes(item))
)

// Using new `Set` primative
const uniqueCombineArrays = (a, b) => [...new Set([...a, ...b])]

// Returns an array of items which are in both arrays a and b
const sharedArrayItems = (a, b) => (
  a.filter((item) => b.includes(item))
)

const sort = (a, b) => {
  if (a?.localeCompare) return a.localeCompare(b)
  if (a < b) return -1
  if (b < a) return 1
  return 0
}

const sortDesc = (a, b) => sort(b, a)

const sortBy = (sortKey, options = {}) => (a, b) => {
  const sortFn = options.desc ? sortDesc : sort
  return sortFn(a[sortKey], b[sortKey])
}

const mapToKey = (array, key, includeFalsy = false) => (
  array.reduce((all, item) => (
    item[key] || includeFalsy ? all.concat(item[key]) : all
  ), [])
)

export {
  excludeItemsFromArray,
  toggleArrayIncludes,
  uniqueCombineArrays,
  sharedArrayItems,
  sort,
  sortDesc,
  sortBy,
  mapToKey,
}
