import { UPDATE } from "./events"

class Store {
  constructor(initValue, observer) {
    this.value = initValue
    this.observer = observer
    this.get = this.get.bind(this)
    this.set = this.set.bind(this)
    this.listen = this.listen.bind(this)
    this.callbacks = []
  }
  listen(callback) {
    return this.observer.listen(UPDATE, () => callback(this.get()))
  }
  setObserver(observer) {
    this.observer = observer
  }
  get(fullPath = "") {
    let v,
      s = this.value
    const pathes = fullPath.split(".").filter(Boolean)
    for (const k of pathes) {
      v = s[k]
      s = v
    }
    return v ?? s
  }
  set(v, fullPath) {
    const pathes = fullPath.split(".")
    const name = pathes.pop()
    let s = this.value
    for (const k of pathes) {
      s = s[k]
    }
    s[name] = v
    this.observer.emit(UPDATE, fullPath)
  }
}

export default Store
