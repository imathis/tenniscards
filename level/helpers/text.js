const camelize = (str) => str.replace(/^([A-Z])|[\s-_](\w)/g, (match, p1, p2) => (
  (p2) ? p2.toUpperCase() : p1.toLowerCase()
))

// Convert a string to a title which matche's AP guidelines
// Modified from Source: https://github.com/gouch/to-title-case
const titleize = (str) => {
  const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i
  const alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/
  const wordSeparators = /([ _:–—-])/

  return str.split(wordSeparators)
    .map((current, index, array) => {
      if (current === '_') return ' '

      if (
        /* Check for small words */
        current.search(smallWords) > -1
        /* Skip first and last word */
        && index !== 0
        && index !== array.length - 1
        /* Ignore title end and subtitle start */
        && array[index - 3] !== ':'
        && array[index + 1] !== ':'
        /* Ignore small words that start a hyphenated phrase */
        && (array[index + 1] !== '-'
          || (array[index - 1] === '-' && array[index + 1] === '-'))
      ) {
        return current.toLowerCase()
      }

      /* Ignore intentional capitalization */
      if (current.substr(1).search(/[A-Z]|\../) > -1) {
        return current
      }

      /* Ignore URLs */
      if (array[index + 1] === ':' && array[index + 2] !== '') {
        return current
      }

      /* Capitalize the first letter */
      return current.replace(alphanumericPattern, (match) => match.toUpperCase())
    })
    .join('')
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
const decamelize = (str) => str.replace(/([A-Z])/g, ' $1').trim()
const camelToTitle = (str) => titleize(decamelize(str))
const dasherize = (str) => decamelize(str).replace(/^([A-Z])|[\s._](\w)/g, (match, p1, p2) => (
  (p2) ? `-${p2.toLowerCase()}` : p1.toLowerCase()
)).replace(/^-/, '').replace(/-+/g, '-')

// Replaces symbols in a string with values from the sources objects
// :str, [{ str: 'Awesome' }] => "Awesome"
const replaceSymbols = (str, sources) => {
  const symbols = str.match(/:\w+/g)
  if (!symbols) return str

  // Allow 0, false, etc
  const goodValue = (val) => typeof val !== 'undefined' && val !== null

  return symbols.reduce((pathName, symbol) => {
    const name = symbol.substr(1) // remove :symbol character

    // Find an object with a good value for the current symbol
    const source = Array(sources).flat().find((f) => f && goodValue(f[name]))

    // If couldn't find any, return the pathname
    return source ? pathName.replace(symbol, source[name]) : pathName
  }, str)
}

// Gets the next string in a logical sequence. So a string "004" would return "005"
// Examples:
//   "12a" => "12b"
//   "<<koala>>" => "<<koalb>>"
//   "aZ" => "bA"
//   "ZZ" => "AAA"
//   "99" => "100"
//   "<<99>>" => "<<100>>"
const next = (str) => {
  if (!str) return str

  // easiest to split the string and walk it backwards
  const reverseArray = str.split('').reverse()

  // These are the string incriment exceptions [<char to replace>, <char to carry>]
  const carryExceptions = {
    Z: ['A', 'A'],
    z: ['a', 'a'],
    9: ['0', '1'],
  }

  let carryDigit = null
  let active = true

  const incrementedArray = reverseArray.map((char) => {
    if (active && char.match(/[a-zA-Z0-9]/)) {
      carryDigit = carryExceptions[char]
      active = !!carryDigit

      return carryDigit ? carryDigit[0] : String.fromCharCode(char.charCodeAt(0) + 1)
    }

    // are we holding a carried digit from a previous item in loop but on a non incrimentable char?
    if (carryDigit) {
      const segment = `${carryDigit[1]}${char}`
      carryDigit = null
      active = false

      return segment
    }

    return char
  })

  // If we need to carry a digit past the original string length "99" -> "100"
  if (carryDigit) incrementedArray.push(carryDigit[1])

  // we have to join and split first since we might have a 2 char string in the array
  // for instance '<9>' => ['>', '0', '1<'] => '<10>'
  return incrementedArray.join('').split('').reverse().join('')
}

const pluralizeText = ({ single, plural, count = 0 }) => {
  const size = Array.isArray(count) ? count.length : count

  if (size !== 1) {
    if (plural) {
      return plural
    }
    return single.slice(-1) === 's' ? `${single}es` : `${single}s`
  }
  return single
}

const pluralize = (single, plural, count) => {
  if (typeof count === 'undefined') {
    // allow plural to be an optional argument
    // in this case the second argument is now counter
    return pluralizeText({ single, plural: null, count: plural })
  }

  return pluralizeText({ single, plural, count })
}

const sentenceJoin = (arr, joinWord = 'and') => {
  if (arr.length <= 2) return arr.join(` ${joinWord} `)
  const last = arr.pop()
  return `${arr.join(', ')}, ${joinWord} ${last}`
}

const formValueEquivalent = (value1, value2) => {
  const values = [value1, value2].map((v) => ((v === null || typeof v === 'undefined') ? '' : String(v)))
  return values[0] === values[1]
}

const stringId = (str) => (
  String(str).replace(/[^0-9a-zA-Z]/g, '').split('').reduce((r, a) => (r * 26 + parseInt(a, 36) - 9), 0)
)

const replaceAutoCompleteTriggers = (str) => (
  str ? str.replace(/ame/gi, '​ame').replace(/mail/gi, 'm​ail').replace(/ontact/gi, 'on​tact') : str
)

const getInitials = (fullName) => {
  const names = fullName.split(' ').map((n) => n.replace(/\W/g, ''))
  return names.map((n, i) => ((i === 0 || i === names.length - 1) ? n[0] : null)).join('').toUpperCase()
}

const isEmail = (str) => !!str.match(/\S+?@\S+?\.\S{2,}/)

const toNumber = (str, options = {}) => {
  const { round = true } = options
  if (str === null || typeof str === 'undefined') return null
  const num = Number.parseFloat(str.replace(/[^\d.]/g, ''))
  return round ? Math.round(num) : num
}

const displayNumber = (num, options = {}) => {
  const {
    separator = ',',
    decimalMarker = '.',
    round = true,
  } = options

  if (num === null || typeof num === 'undefined') return null
  const [number, decimals] = toNumber(String(num), { round }).toString().split(decimalMarker)
  return [number.replace(/\B(?=(\d{3})+(?!\d))/g, separator), decimals].filter((n) => n).join(decimalMarker)
}

export {
  camelize,
  capitalize,
  dasherize,
  decamelize,
  camelToTitle,
  titleize,
  replaceSymbols,
  next,
  pluralize,
  formValueEquivalent,
  sentenceJoin,
  stringId,
  replaceAutoCompleteTriggers,
  getInitials,
  isEmail,
  toNumber,
  displayNumber,
}
