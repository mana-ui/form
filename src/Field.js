import React from "react"

import useComponent from "./useComponent"
import useFieldControl from "./useFieldControl"

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
    fieldRef: field,
    control,
    children,
    label: labelElem,
    render,
    validators = {},
    disabled,
    ...rules
  } = props
  const { context, error, fieldRef } = useFieldControl(
    name ?? field,
    validators,
    rules,
    {
      disabled,
    },
    { label: labelElem },
  )
  const r = render || context.fieldRender || defaultRender
  const c = children ?? control ?? context.control ?? defaultControl
  const formProps = { disabled }
  if (typeof c === "function") {
    formProps.field = fieldRef
  } else {
    formProps.value = fieldRef.value
    if (children) {
      formProps.onChange = (value) => {
        fieldRef.value = value
      }
    } else {
      formProps.onChange = ({ target: { value } }) => {
        fieldRef.value = value
      }
    }
  }

  const Control = useComponent(c, formProps)
  return r({ Control, labelElem, error, id: context.path.fullPath }, props)
}

export default Field
