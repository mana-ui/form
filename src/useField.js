import { useContext, useState, useEffect, useRef, useMemo } from "react"
import { Context } from "./Form"
import { UPDATE, SUBMIT_VALIDATE, VALIDATE } from "./events"
import { VALIDATION_ERROR } from "./constants"
import FieldRef from "./FieldRef"

export default function useField(
  name,
  validators,
  rules,
  options = { disabled: false },
  props,
) {
  const { disabled } = options
  const context = useContext(Context)
  const { store, path: ctxField, validators: ctxValidators } = context
  const { observer } = store
  const v = {
    ...ctxValidators,
    ...validators,
  }
  const fieldRef = useMemo(() => {
    if (name instanceof FieldRef) {
      return name
    }
    return ctxField.extend(name, { inField: true })
  }, [name, ctxField])
  const [updateId, rerender] = useState(0)
  useEffect(() => {
    return observer.listen(
      UPDATE,
      () => {
        rerender((x) => x + 1)
      },
      fieldRef,
    )
  })
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
  const selfValidate = () => {
    if (disabled) {
      return
    }
    const newValue = fieldRef.value
    return Promise.all(
      Object.entries(rules).map(async ([rule, param]) => {
        const error = (await v[rule]?.(newValue, param, props)) || null
        if (error) {
          throw { error, type: VALIDATION_ERROR }
        }
      }),
    ).then(
      () => {
        setError(null)
      },
      (error) => {
        if (error.type === VALIDATION_ERROR) setError(error.error)
        return Promise.reject(error)
      },
    )
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
    if (updateId) {
      validate.current()
    }
  }, [updateId])
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
