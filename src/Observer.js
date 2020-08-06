class Observer {
  constructor() {
    this.register = new Map()
  }
  emit(event, path) {
    const items = this.register.get(event) ?? []
    return Promise.all(
      items
        .filter(({ fullPath }) => fullPath === null || fullPath === path)
        .map(({ callback }) => callback()),
    )
  }
  listen(event, callback, fullPath = null) {
    const item = { fullPath, callback }
    const items = this.register.get(event) ?? []
    this.register.set(event, [...items, item])
    return () => {
      const items = this.register.get(event)
      this.register.set(
        event,
        items.filter((i) => i !== item),
      )
    }
  }
}

export default Observer
