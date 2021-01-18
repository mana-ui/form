import React, { cloneElement } from "react"
import { Context } from "./Form"
import useField from "./useField"

const ArrayField = ({
  name = "",
  validators,
  children,
  getKey = (_, i) => i,
  ...rules
}) => {
  const { context } = useField(name, validators, rules)
  return context.store.get(context.path.fullPath, true).map((v, i) => (
    <Context.Provider
      value={{ ...context, path: context.path.extend(i) }}
      key={getKey(v, i)}
    >
      {children}
    </Context.Provider>
  ))
}

export const Action = ({ children, ...props }) => {
  const { value } = useField("")
  const boundProps = Object.entries(props).reduce((boundProps, [k, v]) => {
    boundProps[k] = () => v(value)
    return boundProps
  }, {})
  return cloneElement(children, { ...children.props, ...boundProps })
}

export default ArrayField
