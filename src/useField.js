import { useContext, useState, useEffect, useRef } from "react"
import { Context } from "./Form"
import { join } from "./path"
import { UPDATE, SUBMIT_VALIDATE, VALIDATE } from "./events"

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
  const [updateId, rerender] = useState(0)
  useEffect(() => {
    return observer.listen(
      UPDATE,
      () => {
        rerender((x) => x + 1)
      },
      fullPath,
    )
  })
  const handleSubmit = async () => {
    if (fullPath !== ctxPath) {
      await observer.emit(SUBMIT_VALIDATE, fullPath)
    }
    return selfValidate()
  }
  useEffect(() => observer.listen(SUBMIT_VALIDATE, handleSubmit, ctxPath))

  const validate = useRef()
  useEffect(() => observer.listen(VALIDATE, () => validate.current(), fullPath))
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
  validate.current = async () => {
    try {
      await selfValidate()
      if (fullPath !== ctxPath) {
        return observer.emit(VALIDATE, ctxPath)
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
  useEffect(() => {
    if (updateId) {
      validate.current()
    }
  }, [updateId])
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
