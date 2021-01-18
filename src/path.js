export const join = (...segments) => {
  return segments.filter((x) => Boolean(x) || x === 0).join(".")
}
