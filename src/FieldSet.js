import React from "react"
import { Context } from "./Form"
import useField from "./useField"

const FieldSet = ({ children, name = "", validators, ...rules }) => {
  const { context, error } = useField(name, validators, rules)
  return (
    <Context.Provider value={context}>
      {typeof children === "function" ? children({ error }) : children}
    </Context.Provider>
  )
}

export default FieldSet
