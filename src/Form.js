import React, { createContext, useRef, useMemo, useLayoutEffect } from "react"

export const Context = createContext()

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
  const reg = useRef([])
  const pending = useRef(new Set())
  vRef.current = value

  const get = (fullPath) => {
    let v,
      s = value
    const pathes = fullPath.split(".")
    for (const k of pathes) {
      v = s[k]
      s = v
    }
    return v
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
    pending.current.add(fullPath)
  }

  const context = useMemo(
    () => ({
      get,
      set,
      fieldRender,
      listen: (fullPath, instance) => {
        const item = { fullPath, instance }
        reg.current = [...reg.current, item]
        return () => {
          reg.current = reg.current.filter((i) => i !== item)
        }
      },
      validators,
      control,
      path: "",
    }),
    [],
  )
  useLayoutEffect(() => {
    for (const { fullPath, instance } of reg.current) {
      if (pending.current.has(fullPath)) {
        pending.current.delete(fullPath)
        const v = get(fullPath)
        instance.current.update(v)
      }
    }
  })
  const submit = () => {
    let allValid = true
    for (const { instance } of reg.current) {
      const error = instance.current.validate()
      if (error) {
        allValid = false
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
