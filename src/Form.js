import React, { createContext, useMemo, useEffect } from "react"
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

  const context = useMemo(
    () => ({
      store,
      fieldRender,
      validators,
      control,
      path: store.rootField,
    }),
    [control, fieldRender, store, validators],
  )
  useEffect(() => {
    return store.observer.listen(SUBMIT, () => {
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
