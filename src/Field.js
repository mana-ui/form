import React, { useContext, useEffect, memo, useState, useRef } from "react"
import { Context } from "./Form"
import useComponent from "./useComponent"
import { join } from "./path"

const defaultControl = <input />

const changed = (a, b) => a !== b && !(Number.isNaN(a) || Number.isNaN(b))

const defaultRender = ({ Control, labelElem, ErrorMessage }) => (
  <div>
    <label>
      {labelElem} <Control />
    </label>
    <ErrorMessage />
  </div>
)

const Field = (props) => {
  const {
    name,
    control,
    label: labelElem,
    render,
    validators = {},
    ...rules
  } = props
  const {
    fieldRender,
    get,
    set,
    listen,
    path: ctxPath,
    control: ctxControl,
    validators: ctxValidators,
  } = useContext(Context)
  const r = render || fieldRender || defaultRender
  const c = control || ctxControl || defaultControl
  const v = {
    ...ctxValidators,
    ...validators,
  }
  const fullPath = join(ctxPath, name)
  const [value, forceUpdate] = useState(() => get(fullPath))
  const [error, setError] = useState(null)
  const prevValue = useRef(value)
  useEffect(() => {
    return listen(fullPath, forceUpdate)
  }, [name])
  const formProps = {}
  if (typeof c === "function") {
    formProps.get = () => value
    formProps.set = (v) => set(v, fullPath)
  } else {
    formProps.value = value
    formProps.onChange = ({ target: { value } }) => {
      set(value, fullPath)
    }
  }

  useEffect(() => {
    let nextError = error
    if (changed(prevValue.current, value)) {
      nextError = null
      for (const [rule, param] of Object.entries(rules)) {
        const message = v[rule]?.(value, param)
        if (message) {
          nextError = message
          break
        }
      }
    }
    setError(nextError)
    prevValue.current = value
  })

  const Control = useComponent(c, formProps)
  const ErrorMessage = useComponent(
    (props) => error && <span {...props}>{error}</span>,
  )
  return r({ Control, labelElem, ErrorMessage, id: name }, props)
}

export default memo(Field)
