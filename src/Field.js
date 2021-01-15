import React from "react"

import useComponent from "./useComponent"
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
    fieldRef: field,
    control,
    label: labelElem,
    render,
    validators = {},
    disabled,
    ...rules
  } = props
  const { context, error, fieldRef } = useField(
    name ?? field,
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
  const get = () => fieldRef.value
  if (typeof c === "function") {
    formProps.get = get
    formProps.set = (v) => (fieldRef.value = v)
  } else {
    formProps.value = get()
    formProps.onChange = ({ target: { value } }) => {
      context.store.set(value, context.path)
    }
  }

  const Control = useComponent(c, formProps)
  return r({ Control, labelElem, error, id: context.path }, props)
}

export default Field
