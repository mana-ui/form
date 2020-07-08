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

const Field = ({
  name,
  control,
  label: labelElem,
  render,
  required,
  validators = [],
  rules: propRules,
}) => {
  const {
    fieldRender,
    get,
    set,
    listen,
    path: ctxPath,
    rules: ctxRules,
    control: ctxControl,
  } = useContext(Context)
  const r = render || fieldRender || defaultRender
  const c = control || ctxControl || defaultControl
  const rules = { ...ctxRules, ...propRules }

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
      if (required) {
        if (!value && value !== 0) {
          nextError = { rule: "required" }
        }
      }
      if (nextError === null) {
        for (let validator of validators) {
          validator =
            typeof validator === "string" ? rules[validator] : validator
          const { validate, message } = validator
          if (!validate(value)) {
            nextError = {
              message:
                typeof message === "string"
                  ? message
                  : message({ label: labelElem }),
            }
            break
          }
        }
      }
    }

    setError(nextError)
    prevValue.current = value
  })

  const Control = useComponent(c, formProps)
  const ErrorMessage = useComponent(
    (props) => error && <span {...props}>{error.message ?? error.rule}</span>,
  )
  return r({ Control, labelElem, ErrorMessage, id: name })
}

export default memo(Field)
