import { VALIDATION_ERROR } from "./constants"
import { SUBMIT, SUBMIT_VALIDATE, UPDATE } from "./events"

export class FieldRef {
  constructor(store, fullPath) {
    this.store = store
    this.fullPath = fullPath
  }
  get value() {
    return this.store.get(this.fullPath)
  }
  set value(v) {
    this.store.set(v, this.fullPath)
  }
}
class Store {
  constructor(initValue, observer) {
    this.value = initValue
    this.observer = observer
    this.get = this.get.bind(this)
    this.set = this.set.bind(this)
    this.listen = this.listen.bind(this)
    this.submit = this.submit.bind(this)
    this.callbacks = []
    this.fields = new Map()
  }
  listen(callback) {
    return this.observer.listen(UPDATE, () => callback(this.get()))
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
  set(updater, fullPath = "") {
    const pathes = fullPath.split(".").filter(Boolean)
    pathes.unshift("value")
    const name = pathes.pop()
    let s = this
    for (const k of pathes) {
      s = s[k]
    }
    if (typeof updater === "function") {
      s[name] = updater(s[name])
    } else {
      s[name] = updater
    }
    this.observer.emit(UPDATE, fullPath)
  }
  fieldRef(fullPath, { inField = false } = {}) {
    if (this.fields.has(fullPath)) {
      if (inField) console.error(`${fullPath} fieldRef already exists`)
    } else {
      const fieldRef = new FieldRef(this, fullPath)
      this.fields.set(fullPath, fieldRef)
    }
    return this.fields.get(fullPath)
  }
  async submit() {
    try {
      await this.observer.emit(SUBMIT_VALIDATE, "")
      this.observer.emit(SUBMIT)
      // eslint-disable-next-line no-empty
    } catch (e) {
      if (e.type !== VALIDATION_ERROR) {
        throw e
      }
    }
  }
}

export default Store
