import PropTypes from 'prop-types'
import { sizes } from '@level/constants/space'

// transform an object's values into spacing lookups
const spaceToSize = (props) => {
  if (typeof props !== 'object') return sizes[props]

  const obj = {}
  Object.keys(props).forEach((key) => {
    obj[key] = sizes[props[key]]
  })
  return obj
}

// Expect integer values, not numbers as strings like '5'.
const validSizes = Object.keys(sizes).map((n) => {
  const num = parseInt(n, 10)
  return Number.isNaN(num) ? n : num
})

spaceToSize.propTypes = {
  space: PropTypes.oneOf(validSizes),
}

export {
  spaceToSize,
  validSizes,
}
