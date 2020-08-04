import { UPDATE, VALIDATE, SUBMIT } from "./events"

const filters = {
  [UPDATE]: (path) => ({ fullPath }) => fullPath === path,
  [VALIDATE]: (path) => ({ fullPath }) => fullPath === path,
  [SUBMIT]: (path) => ({ fullPath }) => fullPath === path,
}

class Observer {
  constructor() {
    this.register = new Map()
  }
  emit(event, path) {
    const items = this.register.get(event) ?? []
    return Promise.all(
      items.filter(filters[event](path)).map(({ callback }) => callback()),
    )
  }
  listen(event, fullPath, callback) {
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
