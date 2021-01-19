import { join } from "./path"

class FieldRef {
  static createRoot(store) {
    const field = new FieldRef()
    field.store = store
    return field
  }
  constructor(parent, name, getPath) {
    this.store = parent?.store
    this.parent = parent
    this.name = name
    this.getPath = getPath ?? (() => join(this.parent?.fullPath, this.name))
    this.children = new Map()
  }
  get fullPath() {
    return this.getPath(this.parent?.fullPath ?? "")
  }
  get fullName() {
    return join(this.parent?.fullName, this.name)
  }
  get value() {
    return this.store.get(this.fullPath)
  }
  set value(v) {
    this.store.set(v, this)
  }
  extend(name, { inField = false, getPath } = {}) {
    const fullName = join(this.fullName, name)
    if (this.fullName === fullName) {
      return this
    }
    if (this.children.has(fullName)) {
      if (inField && name) {
        console.error(`fieldRef of '${fullName}' already exists`)
      }
    } else {
      const fieldRef = new FieldRef(this, name, getPath)
      this.children.set(fullName, fieldRef)
    }
    return this.children.get(fullName)
  }
}

export default FieldRef
