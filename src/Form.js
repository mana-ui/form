import React, { createContext, useRef, useMemo } from "react"
import Observer from "./Observer"
import { UPDATE, SUBMIT } from "./events"

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
  const observerRef = useRef(new Observer())
  const vRef = useRef(value)
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
    observerRef.current.emit(UPDATE, fullPath)
  }
  const context = useMemo(
    () => ({
      observer: observerRef.current,
      unsubSubmit: () => {},
      get,
      set,
      fieldRender,
      validators,
      control,
      path: "",
    }),
    [],
  )
  const submit = async () => {
    try {
      await observerRef.current.emit(SUBMIT, "")
      onSubmit({ value })
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
  return (
    <Context.Provider value={context}>{children({ submit })}</Context.Provider>
  )
}

export default Form
