import React, { useMemo } from "react"
import { Context } from "./Form"
import { join } from "./path"
import useField from "./useField"

class List {
  constructor() {
    this.keys = []
    this.inited = false
    this.nextKey = 1
  }
  getKey() {
    return this.nextKey++
  }
  init(fieldRef) {
    if (this.inited) return
    this.field = fieldRef
    for (let k = 0; k < fieldRef.value.length; k++) {
      this.keys.push(this.getKey())
    }
    this.inited = true
  }
  map(...args) {
    return this.keys.map(...args)
  }
  prepend(v) {
    this.keys.unshift(this.getKey())
    this.field.value = [v, ...this.field.value]
  }
  append(v) {
    const { value } = this.field
    this.keys.push(this.getKey())
    this.field.value = [...value, v]
  }
  remove(i) {
    this.keys.splice(i, 1)
    const { value } = this.field
    value.splice(i, 1)
    this.field.value = value
  }
}

const useListField = ({ name = "" } = {}) => {
  const list = useMemo(() => new List(), [])
  const ListField = useMemo(() => {
    const ListField = ({ children, validators, ...rules }) => {
      const { fieldRef, context } = useField(name, validators, rules)
      list.init(fieldRef)
      return list.map((k, i) => (
        <Context.Provider
          key={k}
          value={{
            ...context,
            path: context.path.extend(k, {
              getPath: (ctxPath) => {
                return join(ctxPath, list.keys.indexOf(k))
              },
            }),
          }}
        >
          {React.cloneElement(children, {
            ...children.props,
            remove: () => list.remove(i),
          })}
        </Context.Provider>
      ))
    }
    return ListField
  }, [list, name])
  return [ListField, list]
}

export default useListField
