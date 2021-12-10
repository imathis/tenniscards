// Docs for DayJS: https://day.js.org
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const formatDate = (value, format = 'MM/DD/YYYY') => (
  value ? dayjs(value).format(format) : null
)

const formatTime = (value, format = 'h:mm A') => (
  value ? dayjs(value).format(format) : null
)

const formatDateAsWords = (value) => (
  value ? dayjs(value).fromNow() : null
)

const formatDaysAsWords = (value) => {
  if (!value) return null
  const unit = value % 7 ? 'day' : 'week'
  const displayValue = unit === 'day' ? value : value / 7

  return `${displayValue} ${unit}${Number(displayValue) === 1 ? '' : 's'}`
}

const addDays = (value, days) => (
  value && days ? dayjs(value).add(days, 'day') : null
)

const subtractDays = (value, days) => (
  addDays(value, -days)
)

const isValidDate = (value) => (
  value ? dayjs(value).isValid() : null
)

const diffDate = (date1, date2, distance = 'day') => (
  date1 && date2 ? dayjs(date2).diff(date1, distance) : null
)

// Add or subtract business days from a date, requires a UTC adjusted date
const adjustByWeekDays = ({ date: startDate, days, mode }) => {
  // move to start of given day
  const date = dayjs(startDate).startOf('day')

  // Day of the week: 0 - 6
  const day = date.day()

  // Use mode to determine whether to add or subtract
  const adjust = (d, size) => d[mode](size, 'day')

  // When adding, weekends begin on Saturday (6)
  // When subtracting, Sunday (0)
  const startOfWeekend = mode === 'add' ? 6 : 0

  // If add mode, calculate remaining days before weekend by subtracting from 5
  // for example Monday == 1, so 5 - 1 == 4 days until weekend
  // When subtracting, days until weekend are calculated in reverse, so day of week can be used
  // since Monday is 1 day from the weekend (sunday)
  const weekSize = mode === 'add' ? 5 - day : day

  // If first day of a weekend, adjust by one day, and recalculate
  if (day === startOfWeekend) return adjustByWeekDays({ date: adjust(date, 1), days, mode })

  // If days fit into current week, business days are a simple adjustment
  if (days < weekSize) return adjust(date, days)

  // If current week is not a full 5 day week, add remaining days + weekend
  // This moves us into the next week to do simpler calculations
  if (weekSize !== 5) {
    const nextFullWeek = adjust(date, weekSize + 2)
    const newLength = days - weekSize
    return adjustByWeekDays({ date: nextFullWeek, days: newLength, mode })
  }

  // From here we're on the first day of a week
  // If adding, it's a Monday. if subtracting, we count backwards from Friday
  // leftOver tracks any partial week at the end
  const leftOver = days % 5

  // Get the number of full weeks
  const weeks = (days - leftOver) / 5

  // Adjusting weekx * 7 lets us add weekends, adding leftoer gives us the last partial week
  return adjust(date, (weeks * 7) + leftOver)
}

const addWeekDays = (date, days) => adjustByWeekDays({ date, days, mode: 'add' })
const subtractWeekDays = (date, days) => adjustByWeekDays({ date, days, mode: 'subtract' })

const weekdaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return null
  // move to start of given day
  const start = dayjs(startDate).startOf('day')
  const end = dayjs(endDate).startOf('day')
  if (end < start) return 0 - weekdaysBetween(end, start)
  const daysBetween = diffDate(start, end)

  // Day of the week: 0 - 6
  const day = start.day()

  // Start counting on a monday.
  if (day === 0) return weekdaysBetween(start.add(1, 'day'), end)
  if (day === 6) return weekdaysBetween(start.add(2, 'day'), end)

  // days left in week
  const weekSize = 6 - day

  // If not a full week remaining
  if (daysBetween < weekSize) return daysBetween

  return weekSize + weekdaysBetween(start.add(weekSize + 2, 'day'), end)
}

const calculateDaysOfFloat = (startDate, dueDate, leadTime) => {
  if (startDate === null || dueDate === null || leadTime === null) return null
  const weekdaysAllowed = weekdaysBetween(startDate, dueDate)
  const weekdaysElapsed = weekdaysBetween(startDate, new Date())
  return weekdaysAllowed - Math.max(weekdaysElapsed, leadTime)
}

const timeAgo = (date, suffix = false) => dayjs(date).fromNow(suffix)
const timeUntil = (date, suffix = false) => dayjs().to(date, suffix)

const timeAgoOrDate = (value, unit = 'hours', limit = 24, format = 'MM/DD/YYYY • h:mm A') => (
  dayjs(value).diff(dayjs(), unit) < limit ? timeAgo(value) : formatDate(value, format)
)

export {
  addDays,
  diffDate,
  subtractDays,
  formatDate,
  formatTime,
  formatDateAsWords,
  formatDaysAsWords,
  isValidDate,
  addWeekDays,
  subtractWeekDays,
  weekdaysBetween,
  calculateDaysOfFloat,
  timeAgo,
  timeAgoOrDate,
  timeUntil,
}
