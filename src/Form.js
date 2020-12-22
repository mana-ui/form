import React, { createContext, useRef, useMemo, useEffect } from "react"
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
  const store = useStore(init)
  const observerRef = useRef(store.observer)

  const context = useMemo(
    () => ({
      observer: observerRef.current,
      get: (path) => store.get(path, true),
      set: store.set,
      fieldRender,
      validators,
      control,
      path: "",
    }),
    [control, fieldRender, store, validators],
  )
  useEffect(() => {
    return observerRef.current.listen(SUBMIT, () => {
      onSubmit({ value: store.get() })
    })
  })
  return (
    <Context.Provider value={context}>
      {typeof children === "function"
        ? children({ submit: store.submit })
        : children}
    </Context.Provider>
  )
}

export default Form
