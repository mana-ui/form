import {
  useContext,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  useCallback,
} from "react"
import { Context } from "./Form"
import { join } from "./path"

const changed = (a, b) => a !== b && !(Number.isNaN(a) || Number.isNaN(b))

export default function useField(name, validators, rules) {
  const context = useContext(Context)
  const {
    depth,
    get,
    register: ctxRegister,
    path: ctxPath,
    validators: ctxValidators,
    notify,
  } = context
  const v = {
    ...ctxValidators,
    ...validators,
  }
  const fullPath = join(ctxPath, name)
  const forceUpdate = useState([])[1]
  const value = get(fullPath)
  const prevValue = useRef(value)
  const [error, setError] = useState(null)
  const validate = () => {
    let error = null
    for (const [rule, param] of Object.entries(rules)) {
      const message = v[rule]?.(value, param)
      if (message) {
        error = message
        break
      }
    }
    setError(error)
    return error
  }

  const instance = useRef()
  const children = useRef([])
  useImperativeHandle(instance, () => ({
    depth,
    name,
    fullPath,
    update: () => forceUpdate([]),
    validate,
    children,
  }))
  useEffect(() => {
    return ctxRegister(instance)
  }, [ctxRegister])
  useEffect(() => {
    if (changed(prevValue.current, value)) {
      const error = validate()
      if (error === null) {
        notify()
      }
    }
    prevValue.current = value
  })
  const register = useCallback((childInstance) => {
    const unregister = ctxRegister(childInstance)
    children.current.push(childInstance)
    return () => {
      unregister()
      children.current = children.current.filter((i) => i !== childInstance)
    }
  }, [])
  return {
    error,
    context: {
      ...context,
      depth: depth + 1,
      path: fullPath,
      register,
      notify: () => {
        validate()
      },
    },
    value,
    ctxPath,
    validators: v,
  }
}
