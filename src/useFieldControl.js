import { useState, useEffect, useRef } from "react"
import { VALIDATION_ERROR } from "./constants"
import { SUBMIT_VALIDATE, VALIDATE } from "./events"
import { useFieldWithUpdateId } from "./useField"

export default function useFieldControl(
  name,
  validators,
  rules,
  options = { disabled: false },
  props,
) {
  const { disabled } = options
  const [
    fieldRef,
    updateId,
    skipValidation,
    context,
    rerender,
  ] = useFieldWithUpdateId(name)
  const { store, path: ctxField, validators: ctxValidators } = context
  const { observer } = store
  const v = {
    ...ctxValidators,
    ...validators,
  }
  const handleSubmit = async () => {
    rerender()
    if (fieldRef !== ctxField) {
      await observer.emit(SUBMIT_VALIDATE, fieldRef)
    }
    return selfValidate()
  }
  useEffect(() => observer.listen(SUBMIT_VALIDATE, handleSubmit, ctxField))

  useEffect(() => observer.listen(VALIDATE, validate.current, fieldRef))
  const [error, setError] = useState(null)
  const selfValidate = async (abortSignal) => {
    if (disabled) {
      return
    }
    const newValue = fieldRef.value
    try {
      for (const [rule, param] of Object.entries(rules)) {
        const error = (await v[rule]?.(newValue, param, props)) || null
        if (abortSignal?.abort) {
          return
        }
        if (error) {
          throw { error, type: VALIDATION_ERROR }
        }
      }
      setError(null)
    } catch (error) {
      if (error.type === VALIDATION_ERROR) {
        setError(error.error)
      }
      throw error
    }
  }
  const validate = useRef()
  validate.current = async (childError, abortSignal) => {
    try {
      let error = childError
      if (childError === null) {
        try {
          error = (await selfValidate(abortSignal)) ?? null
        } catch (e) {
          if (e.type === VALIDATION_ERROR) error = e.error
          else throw e
        }
      }
      if (fieldRef !== ctxField) {
        return observer.emit(VALIDATE, ctxField, error)
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
  useEffect(() => {
    const abortSignal = { abort: false }
    validate.current(null, abortSignal)
    return () => {
      abortSignal.abort = true
    }
  }, [updateId])
  return {
    error: updateId && !skipValidation ? error : null,
    context: {
      ...context,
      path: fieldRef,
    },
    ctxPath: ctxField,
    validators: v,
    fieldRef,
  }
}
