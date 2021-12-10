import { colors } from '@level/constants/allColors'
import { sizes } from '@level/constants/fontSize'
import { badgeSizes as badgeSizeDefaults } from '@level/constants/badgeSizes'
import { dasherize } from '@level/helpers'
import * as icons from '@level/icons'

const toRange = ({ min = 0, max = 100, step = 1 }) => ({
  control: {
    type: 'range', min, max, step,
  },
})

const color = {
  options: ['inherit', ...Object.keys(colors)],
  control: { type: 'select' },
}

const size = {
  options: ['default', ...Object.keys(sizes).map((n) => parseInt(n, 10) || n)],
}

const icon = {
  options: Object.keys(icons).map(dasherize),
  control: { type: 'select' },
}

const width = toRange({ max: 200 })
const height = toRange({ max: 200 })

const badgeSizeNumbers = Object.keys(badgeSizeDefaults).map((n) => parseInt(n, 10))
const badgeSizes = toRange({
  min: Math.min(...badgeSizeNumbers),
  max: Math.max(...badgeSizeNumbers),
})

const toChoices = (options, control = { type: 'select' }) => ({
  options,
  control,
})

export {
  size,
  color,
  icon,
  height,
  width,
  badgeSizes,
  toChoices,
}
