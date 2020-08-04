import { useContext, useState, useEffect, useRef } from "react"
import { Context } from "./Form"
import { join } from "./path"
import { UPDATE, SUBMIT, VALIDATE } from "./events"

export default function useField(name, validators, rules) {
  const context = useContext(Context)
  const { observer, get, path: ctxPath, validators: ctxValidators } = context
  const v = {
    ...ctxValidators,
    ...validators,
  }
  const fullPath = join(ctxPath, name)
  const forceUpdate = useState([])[1]
  useEffect(() =>
    observer.listen(UPDATE, fullPath, () => {
      forceUpdate([])
    }),
  )
  const handleSubmit = async () => {
    await observer.emit(SUBMIT, fullPath)
    return selfValidate()
  }
  useEffect(() => observer.listen(SUBMIT, ctxPath, handleSubmit))
  useEffect(() => observer.listen(VALIDATE, fullPath, validate))
  const value = get(fullPath)
  const [error, setError] = useState(null)
  const selfValidate = () => {
    let error = null
    for (const [rule, param] of Object.entries(rules)) {
      const message = v[rule]?.(value, param)
      if (message) {
        error = message
        break
      }
    }

    setError(error)
    if (error) throw error
  }
  const validate = async () => {
    try {
      selfValidate()
      return observer.emit(VALIDATE, ctxPath)
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
  const mounted = useRef(false)
  useEffect(() => {
    if (mounted.current) validate()
    mounted.current = true
  })
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
