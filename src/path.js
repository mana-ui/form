export const join = (...segments) => {
  return segments.filter(Boolean).join(".")
}
