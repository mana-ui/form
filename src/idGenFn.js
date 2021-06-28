const idGenFn = function* () {
  let i = 0
  while (true) {
    yield i
    i++
  }
}

export default idGenFn
