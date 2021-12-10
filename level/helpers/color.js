import PropTypes from 'prop-types'
import { colors } from '../constants/allColors'

const stretchHex = ([a, b, c, d]) => [a, a, b, b, c, c, d, d].join('')

const tupleHex = (color) => color.match(/(.{2})(.{2})(.{2})(.{2})?/).slice(1)

const isPresent = (val) => typeof val !== 'undefined'

const allPresent = (arr) => arr.filter((v) => isPresent(v)).length === arr.length

const constrain = (val, max) => Math.min(Math.max(val, 0), max || 100)

const validHslaObject = ({
  hue, sat, lum, alpha,
}) => (hue >= 0 && hue <= 360)
    && (sat >= 0 && sat <= 100)
    && (lum >= 0 && lum <= 100)
    && (typeof alpha === 'undefined' || (alpha >= 0 && alpha <= 1))

const validRgbaObject = ({
  red, blue, green, alpha,
}) => (red >= 0 && red <= 255)
    && (blue >= 0 && blue <= 255)
    && (green >= 0 && green <= 255)
    && (typeof alpha === 'undefined' || (alpha >= 0 && alpha <= 1))

const validHsla = (str) => {
  const match = str.match(/hsla?\((.+)\)/)
  const arr = match[1].split(/,\s*/).map((v) => Number.parseFloat(v))
  const color = {
    hue: arr[0], sat: arr[1], lum: arr[2], alpha: arr[3],
  }
  return validHslaObject(color)
}

const validRgba = (str) => {
  const match = str.match(/rgba?\((.+)\)/)
  const arr = match[1].split(/,\s*/).map((v) => Number.parseFloat(v))
  const color = {
    red: arr[0], blue: arr[1], green: arr[2], alpha: arr[3],
  }
  return validRgbaObject(color)
}

// Validates hex colors with lengths: 3,6,8. (Those with 4 or 8 length contain alpha channel)
const validHex = (str) => /^#([A-Fa-f0-9]+)$/.test(str) && [3, 4, 6, 8].indexOf(str.replace(/#/, '').length) !== -1

const colorType = (str) => {
  if (/hsla?\(.+?\)/.test(str) && validHsla(str)) return 'hsla'
  if (/rgba?\(.+?\)/.test(str) && validRgba(str)) return 'rgba'
  if (/#/.test(str) && validHex(str)) return 'hex'
  return null
}

const validColor = (str) => !!colorType(str)

const convertHue = (p, q, h) => {
  let H = h
  if (h < 0) H += 1
  if (h > 1) H -= 1

  if (H * 6 < 1) return p + (q - p) * H * 6
  if (H * 2 < 1) return q
  if (H * 3 < 2) return p + (q - p) * (2 / 3 - H) * 6
  return p
}

const getHue = (r, g, b, min, max, diff) => {
  if (min === max) return 0
  if (r === max) return ((60 * (g - b)) / diff + 360) % 360
  if (g === max) return (60 * (b - r)) / diff + 120
  return (60 * (r - g)) / diff + 240
}

const getSat = (lum, diff, add) => {
  if (lum === 0) return lum
  if (lum === 1) return lum
  if (lum <= 0.5) return diff / add
  return diff / (2 - add)
}

const colorToArray = (color) => {
  const arr = color
    .match(/\((.+?)\)/)[1]
    .split(/,\s*/)
    .map((c) => Number.parseFloat(c))

  if (arr.length === 3) arr.push(1)
  return arr
}

const rgba = {
  from: {
    hex: (color) => {
      let hex = color.hex.replace('#', '')
      let alpha = isPresent(color.alpha) ? color.alpha : 1

      if (hex.length < 6) hex = stretchHex(hex)
      const tuple = tupleHex(hex)
      if (tuple[3]) alpha = Math.round((parseInt(tuple.pop(), 16) / 255) * 100) / 100
      const [red, green, blue] = tuple.map((c) => parseInt(c, 16))
      return {
        red, green, blue, alpha,
      }
    },

    hsla: (color) => {
      const hue = color.hue / 360
      const sat = color.sat / 100
      const lum = color.lum / 100

      const q = lum <= 0.5 ? lum * (1 + sat) : lum + sat - lum * sat
      const p = 2 * lum - q
      const rt = hue + 1 / 3
      const gt = hue
      const bt = hue - 1 / 3

      const red = Math.round(convertHue(p, q, rt) * 255)
      const green = Math.round(convertHue(p, q, gt) * 255)
      const blue = Math.round(convertHue(p, q, bt) * 255)

      return {
        red, green, blue, alpha: isPresent(color.alpha) ? color.alpha : 1,
      }
    },
  },

  str: (color) => `rgba(${color.red},${color.green},${color.blue},${color.alpha})`,
}

const hsla = {
  from: {
    rgba: (color) => {
      const [r, g, b] = [color.red, color.green, color.blue].map((c) => c / 255)

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const diff = max - min
      const add = max + min

      const hue = Math.round(getHue(r, g, b, min, max, diff))
      const lum = Math.round(0.5 * add * 100)
      const sat = Math.round(getSat(lum / 100, diff, add) * 100)

      return {
        hue, sat, lum, alpha: isPresent(color.alpha) ? color.alpha : 1,
      }
    },

    hex: (color) => hsla.from.rgba(rgba.from.hex(color)),
  },
  str: (color) => `hsla(${color.hue},${color.sat}%,${color.lum}%,${color.alpha})`,
}

const Hex = {
  from: {
    hsla: (color) => Hex.from.rgba(rgba.from.hsla(color)),
    rgba: ({
      red, blue, green, alpha,
    }) => {
      const hexColor = [red, green, blue, isPresent(alpha) ? alpha : 1]
        .map((c, index) => {
          if (index === 3) {
            return c === 1 ? '' : (Math.round(c * 255) + 0x10000).toString(16).substr(-2)
          }
          let part = Number.parseFloat(c).toString(16)
          if (part.length === 1) part = `0${part}`
          return part
        })
        .join('')
      return `#${hexColor}`
    },
  },

  str: (color) => color.hex,
}

const translate = (color) => {
  if (allPresent([color.hue, color.sat, color.lum])) {
    return {
      ...color,
      ...rgba.from.hsla(color),
      hex: Hex.from.hsla(color),
      alpha: color.alpha || 1,
    }
  } if (allPresent([color.red, color.green, color.blue])) {
    return {
      ...color,
      ...hsla.from.rgba(color),
      hex: Hex.from.rgba(color),
      alpha: color.alpha || 1,
    }
  } if (color.hex) {
    return {
      ...rgba.from.hex(color),
      ...hsla.from.hex(color),
      alpha: color.alpha || 1,
    }
  }

  return color
}

const constrainColor = (color) => {
  let {
    hue, sat, lum, red, green, blue, alpha,
  } = color

  if (isPresent(hue)) hue = (hue === 360) ? 360 : (hue + 360) % 360
  if (isPresent(sat)) sat = constrain(sat, 100)
  if (isPresent(lum)) lum = constrain(lum, 100)
  if (isPresent(red)) red = constrain(red, 255)
  if (isPresent(green)) green = constrain(green, 255)
  if (isPresent(blue)) blue = constrain(blue, 255)
  if (isPresent(alpha)) alpha = constrain(alpha, 1)

  return {
    hue, sat, lum, red, green, blue, alpha,
  }
}

const colorObject = (str) => {
  const type = colorType(str)
  const color = {}

  if (type) {
    if (type === 'hex') color.hex = str
    if (type === 'hsla') [color.hue, color.sat, color.lum, color.alpha] = colorToArray(str)
    if (type === 'rgba') [color.red, color.green, color.blue, color.alpha] = colorToArray(str)
    color.alpha = isPresent(color.alpha) ? color.alpha : 1

    return color
  }
  return null
}

// Expects a color object like { hex: "#fff" } or { hsla: "hsla(240, 30%, 70%, 1)" }
// Returns an object with format conversion and tranformation functions
const colorFromString = (str) => {
  const type = colorType(str)
  if (!type) return new Error(`Invalid color format: ${str}. Must be hex, rgba, or hsla.`)
  return colorObject(str)
}

// Delete props which will be outdated by this adjustment
const clearAdjustmentProps = ({
  hue, sat, lum, alpha, red, green, blue, hex,
}, props) => {
  const reset = { alpha: (isPresent(props.alpha) ? null : alpha) }

  // Adjustments include HSL values, return RGB and hex values only
  if (isPresent(props.hue) || isPresent(props.sat) || isPresent(props.lum)) {
    return {
      ...reset, hue, sat, lum,
    }
  }

  // Adjustments include RGB values, return HLS and hex values only
  if (isPresent(props.red) || isPresent(props.blue) || isPresent(props.green)) {
    return {
      ...reset, red, green, blue,
    }
  }

  // Adjustmenst include hex, only return hex
  if (isPresent(props.hex)) return { hex }

  // Adjustments only include alpha, return everything except alpha
  return {
    hue, sat, lum, red, green, blue, hex,
  }
}

const setColor = (current, props = {}) => {
  const changes = (typeof props === 'string') ? colorFromString(props) : props
  const color = clearAdjustmentProps(current, changes)

  return translate(constrainColor({ ...color, ...changes }))
}

const adjustColor = (current, props = {}) => {
  const changes = (typeof props === 'string') ? colorFromString(props) : props
  const newColor = clearAdjustmentProps(current, changes)

  Object.keys(changes).forEach((k) => {
    newColor[k] = current[k] + changes[k]
  })

  return translate(constrainColor(newColor))
}

// Expects a valid color string or obejct:
// { hue, sat, lum, (alpha) }
// or { red, green, blue, (alpha) }
// or { hex: '#000000' }
const transformColor = (obj) => {
  const color = (obj.str) ? translate(colorFromString(obj.str)) : translate(obj)

  const c = {
    ...color,
    hsla: hsla.str(color),
    rgba: rgba.str(color),
    toString: () => (color.alpha < 1 ? c.rgba : c.hex),
    adjust: (props) => transformColor(adjustColor(color, props)),
    set: (props) => transformColor(setColor(color, props)),
    lighten: (adj) => c.adjust({ lum: adj }),
    darken: (adj) => c.adjust({ lum: -Math.abs(adj) }),
    saturate: (adj) => c.adjust({ sat: adj }),
    desaturate: (adj) => c.adjust({ sat: -Math.abs(adj) }),
  }

  return c
}

const propValidBetween = (min, max) => (props, propName, componentName) => {
  if (props[propName] < min || max < props[propName]) {
    return new Error(`Invalid Prop: "${propName}" supplied to ${componentName} : must be between 0 and 360, was ${props[propName]}`)
  }
  return true
}

transformColor.propTypes = {
  hue: propValidBetween(0, 360),
  sat: propValidBetween(0, 100),
  lum: propValidBetween(0, 100),
  alpha: propValidBetween(0, 1),
  red: propValidBetween(0, 255),
  green: propValidBetween(0, 255),
  blue: propValidBetween(0, 255),
  hex: ({ hex }, propName, componentName) => {
    if (!validHex(hex)) return new Error(`Invalid Prop: "hex" supplied to ${componentName} : ${hex} is not a valid hex color`)
    return true
  },
  str: ({ str }, propName, componentName) => {
    if (!validColor(str)) return new Error(`Invalid Prop: "str" supplied to ${componentName} : ${str} is not a valid color`)
    return true
  },
}

const toColor = (props) => {
  if (!props) return null
  if (typeof props !== 'object') return colors[props]

  return Object.keys(props).reduce((obj, key) => (
    { ...obj, [key]: colors[props[key]] }), {})
}

toColor.propTypes = {
  color: PropTypes.oneOf(['inherit', ...Object.keys(colors)]),
}

const colorControl = {
  options: ['inherit', ...Object.keys(colors)],
  control: { type: 'select' },
}

export {
  transformColor as Color,
  toColor,
  colorControl,
}
