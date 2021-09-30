import { VALIDATION_ERROR } from "./constants"
import { SUBMIT, SUBMIT_VALIDATE, UPDATE } from "./events"
import cloneDeep from "lodash.clonedeep"
import FieldRef from "./FieldRef"

class Store {
  constructor(initValue, observer) {
    this.value = cloneDeep(initValue)
    this.observer = observer
    this.get = this.get.bind(this)
    this.set = this.set.bind(this)
    this.listen = this.listen.bind(this)
    this.submit = this.submit.bind(this)
    this.callbacks = []
    this.fields = new Map()
    this.rootField = FieldRef.createRoot(this)
  }
  listen(callback, fieldRef = null) {
    return this.observer.listen(
      UPDATE,
      () => {
        this.skipValidation = true
        callback(fieldRef ? fieldRef.value : this.get())
        this.skipValidation = false
      },
      fieldRef,
    )
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
  set(updater, field) {
    const pathes = field.fullPath.split(".").filter(Boolean)
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
    this.observer.emit(UPDATE, field, this.skipValidation)
  }
  field(path) {
    const pathes = path.split(".")
    let field = this.rootField
    for (const p of pathes) {
      field = field.extend(p)
    }
    return field
  }
  async submit() {
    try {
      await this.observer.emit(SUBMIT_VALIDATE, this.rootField)
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
