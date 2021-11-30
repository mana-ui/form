import { VALIDATION_ERROR } from "./constants"
import { SUBMIT, SUBMIT_VALIDATE, UPDATE } from "./events"
import cloneDeep from "lodash.clonedeep"
import FieldRef from "./FieldRef"
import { split } from "./path"

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
    this.plumbing = null
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
    const pathes = split(fullPath)
    for (const k of pathes) {
      v = s[k]
      s = v
    }
    return v ?? s
  }
  set(updater, field) {
    const pathes = split(field.fullPath)
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
    if (this.plumbing) {
      this.plumbing.add(field)
    } else {
      this.observer.emit(UPDATE, field, this.skipValidation)
    }
  }
  fill() {
    this.plumbing = new Set()
  }
  drain() {
    for (const field of this.plumbing) {
      this.observer.emit(UPDATE, field, this.skipValidation)
    }
    this.plumbing = null
  }
  batch(updater) {
    this.fill()
    try {
      updater()
    } finally {
      this.drain()
    }
  }
  field(path) {
    console.error("form.field is deprecated, use useField instead")
    const pathes = split(path)
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
    } catch (e) {
      if (e.type !== VALIDATION_ERROR) {
        throw e
      }
    }
  }
}

export default Store
