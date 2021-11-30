import { join } from "./path"

// class IndexedMap {
//   constructor() {
//     this.arr = []
//   }
//   has(key) {
//     return this.arr.some(([k]) => k === key)
//   }
//   get(key) {
//     return this.arr.find(( [k] ) => k === key)?.[1]
//   }
//   set(key, value) {
//     const entry = this.get(key)
//     if (entry) {
//       entry[1] = value
//     } else {
//       this.arr.push([key, value])
//     }
//     return this
//   }
// }

class FieldRef {
  static createRoot(store) {
    const field = new FieldRef()
    field.store = store
    return field
  }
  constructor(parent, name, getPath, hookId) {
    this.store = parent?.store
    this.parent = parent
    this.name = name
    this.getPath =
      getPath ??
      (() => {
        return join(this.parent?.fullPath, this.name)
      })
    this.children = new Map()
    this.hookId = hookId
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
  field(name) {
    const fullName = join(this.fullName, name)
    if (this.fullName === fullName) {
      return this
    }
    return this.children.get(fullName)
  }
  extend(name, { hookId, getPath } = {}) {
    const fullName = join(this.fullName, name)
    let fieldRef = this.field(name)
    if (fieldRef) {
      if (fieldRef.hookId === null) {
        fieldRef.hookId = hookId
      }
    } else {
      fieldRef = new FieldRef(this, name, getPath, hookId)
      this.children.set(fullName, fieldRef)
    }
    return fieldRef
  }
}

export default FieldRef
