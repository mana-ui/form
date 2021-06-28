import React, { cloneElement } from "react"
import { Context } from "./Form"
import useFieldControl from "./useFieldControl"

const ArrayField = ({
  name = "",
  validators,
  children,
  getKey = (_, i) => i,
  ...rules
}) => {
  const { context } = useFieldControl(name, validators, rules)
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
  const { value } = useFieldControl("")
  const boundProps = Object.entries(props).reduce((boundProps, [k, v]) => {
    boundProps[k] = () => v(value)
    return boundProps
  }, {})
  return cloneElement(children, { ...children.props, ...boundProps })
}

export default ArrayField
