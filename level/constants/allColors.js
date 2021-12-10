// Colors with families
const families = {
  neutral: {
    25: '#FAFAFA',
    50: '#F4F4F4',
    100: '#e8e9ea',
    200: '#ccced6',
    300: '#a4aaba',
    400: '#7e889e',
    500: '#636d87',
    600: '#414d6d',
    700: '#323e5e',
    800: '#1e2749',
    900: '#141B41',
  },
  blue: {
    25: '#ECF0FD',
    50: '#DAE2FB',
    100: '#CED7FA',
    200: '#B6C5F7',
    300: '#8FA6F3',
    400: '#6B8AEF',
    500: '#587BEE',
    600: '#325EEA',
    700: '#1951DB',
    800: '#1646DE',
    900: '#163FCB',
  },
  green: {
    25: '#E7F8F4',
    50: '#D1F2E7',
    100: '#C2EFE1',
    200: '#9CE8D0',
    300: '#82DDC3',
    400: '#57CEA9',
    500: '#3BC9A1',
    600: '#05BB89',
    700: '#02AF76',
    800: '#009E65',
    900: '#008954',
  },
  orange: {
    25: '#FFF4EB',
    50: '#FEDDC3',
    100: '#FDC69B',
    200: '#FCB173',
    300: '#FA9A4B',
    400: '#FB8423',
    500: '#F07512',
    600: '#E86B05',
    700: '#DD5900',
    800: '#D84B0E',
    900: '#CC3A00',
  },
  yellow: {
    25: '#FFF9EB',
    50: '#FFF3D6',
    100: '#FFEDC2',
    200: '#FFE099',
    300: '#FED470',
    400: '#FFC847',
    500: '#FFBB23',
    600: '#FFAB00',
    700: '#FF9D00',
    800: '#F28A00',
    900: '#E87E00',
  },
  aqua: {
    25: '#EDF9FC',
    50: '#DBF2FB',
    100: '#B6E5F7',
    200: '#8FD9F3',
    300: '#6BCCEF',
    400: '#47C0EB',
    500: '#32B9EA',
    600: '#03ABE8',
    700: '#049CE4',
    800: '#028AD0',
    900: '#0379BC',
  },
  red: {
    25: '#FDEFEB',
    50: '#FCDED9',
    100: '#F9BEB3',
    200: '#F59D8D',
    300: '#F58D7A',
    400: '#F16D54',
    500: '#F05D41',
    600: '#EF4326',
    700: '#DB2A12',
    800: '#BA100C',
    900: '#FCEBEB',
  },
  purple: {
    25: '#F5EAF9',
    50: '#E9D3EF',
    100: '#D6AFE0',
    200: '#CA93D8',
    300: '#C27DD3',
    400: '#B06BC1',
    500: '#9E4BB2',
    600: '#8F359E',
    700: '#772B87',
    800: '#682277',
    900: '#5C1968',
  },
}

// Simple colors without families
const simple = {
  white: '#fff',
  black: '#000',
}

const mergeColors = (base, alias) => {
  const obj = { ...base }
  Object.keys(alias).forEach((key) => {
    obj[key] = { ...obj[key], ...alias[key] }
  })
  return obj
}

// Add color aliases with families
const aliases = {
  blue: {
    primary: families.blue[600],
  },
  green: {
    primary: families.green[600],
  },
  orange: {
    primary: families.orange[600],
  },
  yellow: {
    primary: families.yellow[600],
  },
  aqua: {
    primary: families.aqua[500],
  },
  red: {
    primary: families.red[500],
  },
  purple: {
    primary: families.purple[600],
  },
  text: {
    default: families.neutral[900],
    light: families.neutral[500],
  },
}

const flatten = (obj) => {
  const flat = {}
  Object.keys(obj).forEach((base) => {
    Object.keys(obj[base]).forEach((variant) => {
      flat[`${base}-${variant}`] = obj[base][variant]
    })
  })
  return flat
}

module.exports = {
  simple,
  families,
  aliases: flatten(aliases),
  colors: {
    ...simple,
    ...flatten(mergeColors(families, aliases)),
  },
}
