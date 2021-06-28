import React from "react"
import { Context } from "./Form"
import useFieldControl from "./useFieldControl"

const FieldSet = ({ children, name = "", validators, ...rules }) => {
  const { context, error } = useFieldControl(name, validators, rules)
  return (
    <Context.Provider value={context}>
      {typeof children === "function" ? children({ error }) : children}
    </Context.Provider>
  )
}

export default FieldSet
