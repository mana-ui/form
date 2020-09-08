import { useContext, useState, useEffect } from "react"
import { Context } from "./Form"
import { join } from "./path"
import { UPDATE, SUBMIT, VALIDATE } from "./events"

export default function useField(
  name,
  validators,
  rules,
  options = { disabled: false },
) {
  const { disabled } = options
  const context = useContext(Context)
  const { observer, get, path: ctxPath, validators: ctxValidators } = context
  const v = {
    ...ctxValidators,
    ...validators,
  }
  const fullPath = join(ctxPath, name)
  const [updated, forceUpdate] = useState(0)
  useEffect(() => {
    return observer.listen(
      UPDATE,
      () => {
        forceUpdate((x) => x + 1)
      },
      fullPath,
    )
  })
  useEffect(() => {
    if (updated) {
      validate()
    }
  })
  const handleSubmit = async () => {
    if (fullPath !== ctxPath) {
      await observer.emit(SUBMIT, fullPath)
    }
    return selfValidate()
  }
  useEffect(() => observer.listen(SUBMIT, handleSubmit, ctxPath))
  useEffect(() => observer.listen(VALIDATE, validate, fullPath))
  const value = get(fullPath)
  const [error, setError] = useState(null)
  const selfValidate = () => {
    if (disabled) {
      return
    }
    const newValue = get(fullPath)
    return Promise.all(
      Object.entries(rules).map(async ([rule, param]) => {
        const error = (await v[rule]?.(newValue, param)) || null
        if (error) throw error
      }),
    ).then(
      () => {
        setError(null)
      },
      (error) => {
        setError(error)
        return Promise.reject(error)
      },
    )
  }
  const validate = async () => {
    try {
      await selfValidate()
      if (fullPath !== ctxPath) {
        return observer.emit(VALIDATE, ctxPath)
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
  return {
    error,
    context: {
      ...context,
      path: fullPath,
    },
    value,
    ctxPath,
    validators: v,
  }
}
