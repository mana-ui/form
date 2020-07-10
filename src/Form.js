import React, { createContext, useRef, useMemo, useEffect } from "react"

export const Context = createContext()

const Form = ({
  children,
  value,
  setValue,
  fieldRender,
  validators,
  control,
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
      listen: (fullPath, callback) => {
        reg.current = [...reg.current, { fullPath, callback }]
        return () => {
          reg.current = reg.current.filter(
            ({ name: n, callback: c }) => n !== fullPath || c !== callback,
          )
        }
      },
      validators,
      control,
      path: "",
    }),
    [],
  )
  useEffect(() => {
    for (const { fullPath, callback } of reg.current) {
      if (pending.current.has(fullPath)) {
        pending.current.delete(fullPath)
        const v = get(fullPath)
        callback(v)
      }
    }
  })
  return <Context.Provider value={context}>{children({})}</Context.Provider>
}

export default Form
