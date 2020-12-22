import React from "react"

import useComponent from "./useComponent"
import { join } from "./path"
import useField from "./useField"

const defaultControl = <input />

const defaultRender = ({ Control, labelElem, error }) => (
  <div>
    <label>
      {labelElem} <Control />
    </label>
    {error}
  </div>
)

const Field = (props) => {
  const {
    name,
    control,
    label: labelElem,
    render,
    validators = {},
    disabled,
    ...rules
  } = props
  const { context, value, error, ctxPath } = useField(
    name,
    validators,
    rules,
    {
      disabled,
    },
    { label: labelElem },
  )
  const r = render || context.fieldRender || defaultRender
  const c = control || context.control || defaultControl
  const formProps = { disabled }
  if (typeof c === "function") {
    formProps.get = () => value
    formProps.set = (v, n = name) => context.set(v, join(ctxPath, n))
  } else {
    formProps.value = value
    formProps.onChange = ({ target: { value } }) => {
      context.set(value, context.path)
    }
  }

  const Control = useComponent(c, formProps)
  return r({ Control, labelElem, error, id: context.path }, props)
}

export default Field
