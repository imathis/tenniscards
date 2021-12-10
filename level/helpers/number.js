const isNumber = (val, options = { float: false }) => (
  !Number.isNaN(options.float
    ? Number.parseFloat(val)
    : Number.parseInt(val, 10))
)

export { isNumber }
