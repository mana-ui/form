import React, { createContext, useRef, useMemo } from "react"

export const Context = createContext()

const init = (reg, key) => {
  const instances = []
  reg.set(key, instances)
  return instances
}
const Form = ({
  children,
  value,
  setValue,
  fieldRender,
  validators,
  control,
  onSubmit,
}) => {
  const vRef = useRef(value)
  const reg = useRef(new Map())
  vRef.current = value

  const get = (fullPath) => {
    let v,
      s = value
    const pathes = fullPath.split(".").filter(Boolean)
    for (const k of pathes) {
      v = s[k]
      s = v
    }
    return v ?? s
  }

  const set = (v, fullPath) => {
    const pathes = fullPath.split(".")
    const name = pathes.pop()
    let s = value
    for (const k of pathes) {
      s = s[k]
    }
    s[name] = v
    setValue(value)
    const instances = reg.current.get(fullPath)
    for (const instance of instances) {
      instance.current.update(v)
    }
  }
  const context = useMemo(
    () => ({
      depth: 0,
      get,
      set,
      fieldRender,
      register: (instance) => {
        const register = reg.current
        const { fullPath } = instance.current
        const instances = register.get(fullPath) ?? init(register, fullPath)
        instances.push(instance)
        return () => {
          const i = instances.findIndex((x) => x === instance)
          instances.splice(i, 1)
        }
      },
      validators,
      control,
      path: "",
      notify: () => {},
    }),
    [],
  )
  const submit = () => {
    let allValid = true
    for (const instances of reg.current.values()) {
      for (const { current } of instances) {
        if (current.depth === 0) {
          const error = current.validate()
          if (error) {
            allValid = false
          }
        }
      }
    }
    if (allValid) {
      onSubmit({ value })
    }
  }
  return (
    <Context.Provider value={context}>{children({ submit })}</Context.Provider>
  )
}

export default Form
