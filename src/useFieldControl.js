import { useState, useEffect, useRef } from "react"
import { SUBMIT_VALIDATE, VALIDATE } from "./events"
import { VALIDATION_ERROR } from "./constants"
import { useFieldWithUpdateId } from "./useField"

export default function useFieldControl(
  name,
  validators,
  rules,
  options = { disabled: false },
  props,
) {
  const { disabled } = options
  const [fieldRef, updateId, skipValidation, context] = useFieldWithUpdateId(
    name,
  )
  const { store, path: ctxField, validators: ctxValidators } = context
  const { observer } = store
  const v = {
    ...ctxValidators,
    ...validators,
  }
  const handleSubmit = async () => {
    if (fieldRef !== ctxField) {
      await observer.emit(SUBMIT_VALIDATE, fieldRef)
    }
    return selfValidate()
  }
  useEffect(() => observer.listen(SUBMIT_VALIDATE, handleSubmit, ctxField))

  const validate = useRef()
  useEffect(() => observer.listen(VALIDATE, () => validate.current(), fieldRef))
  const [error, setError] = useState(null)
  const selfValidate = async () => {
    if (disabled) {
      return
    }
    const newValue = fieldRef.value
    try {
      for (const [rule, param] of Object.entries(rules)) {
        const error = (await v[rule]?.(newValue, param, props)) || null
        if (error) {
          throw { error, type: VALIDATION_ERROR }
        }
      }
      setError(null)
    } catch (error) {
      if (error.type === VALIDATION_ERROR) setError(error.error)
      throw error
    }
  }
  validate.current = async () => {
    try {
      await selfValidate()
      if (fieldRef !== ctxField) {
        return observer.emit(VALIDATE, ctxField)
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
  useEffect(() => {
    if (updateId && !skipValidation) {
      validate.current()
    }
  }, [updateId, skipValidation])
  return {
    error,
    context: {
      ...context,
      path: fieldRef,
    },
    ctxPath: ctxField,
    validators: v,
    fieldRef,
  }
}
