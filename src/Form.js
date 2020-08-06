import React, { createContext, useRef, useMemo } from "react"
import Observer from "./Observer"
import { SUBMIT } from "./events"
import useStore from "./useStore"

export const Context = createContext()

const Form = ({
  init,
  children,
  fieldRender,
  validators,
  control,
  onSubmit,
}) => {
  const observerRef = useRef(new Observer())
  const store = useStore(init, observerRef.current)

  const context = useMemo(
    () => ({
      observer: observerRef.current,
      get: store.get,
      set: store.set,
      fieldRender,
      validators,
      control,
      path: "",
    }),
    [control, fieldRender, store, validators],
  )
  const submit = async () => {
    try {
      await observerRef.current.emit(SUBMIT, "")
      onSubmit({ value: store.get() })
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
  return (
    <Context.Provider value={context}>{children({ submit })}</Context.Provider>
  )
}

export default Form
