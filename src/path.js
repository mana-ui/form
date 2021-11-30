export const join = (...segments) => {
  return segments.filter((x) => Boolean(x) || x === 0).join(".")
}

export const split = (str, separator = ".") =>
  str.split(separator).filter(Boolean)
