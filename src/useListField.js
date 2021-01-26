import { useContext } from "react"
import FieldRef from "./FieldRef"
import { Context } from "./Form"
import useExtendField from "./useExtendField"

class List extends FieldRef {
  constructor(...args) {
    super(...args)
    this.keys = []
    this.nextKey = 1
    for (let k = 0; k < super.value.length; k++) {
      this.keys.push(this.getKey())
    }
  }
  set value(v) {
    throw new Error("List can not use value setter")
  }
  clear() {
    this.keys = []
    super.value = []
  }
  getKey() {
    return this.nextKey++
  }
  map(...args) {
    return this.keys.map(...args)
  }
  prepend(v) {
    this.keys.unshift(this.getKey())
    const value = super.value
    super.value = [v, ...value]
  }
  append(v) {
    const value = super.value
    this.keys.push(this.getKey())
    super.value = [...value, v]
  }
  remove(i) {
    this.keys.splice(i, 1)
    const value = super.value
    value.splice(i, 1)
    super.value = value
  }
}

const useListField = ({ field } = {}) => {
  const context = useContext(Context)
  const { path } = context
  const fieldRef = useExtendField(field, path, List)
  return fieldRef
}

export default useListField
