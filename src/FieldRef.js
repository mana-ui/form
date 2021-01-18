class FieldRef {
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
  extend(name, options) {
    return this.store.fieldRef(this.fullPath, name, options)
  }
}

export default FieldRef
