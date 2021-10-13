import { useContext, useEffect, useMemo, useReducer, useRef } from "react"
import { UPDATE } from "./events"
import FieldRef from "./FieldRef"
import { Context } from "./Form"
import idGenFn from "./idGenFn"
import invariant from "invariant"
import { join } from "./path"

const idGen = idGenFn()

const useFieldRefWithHookId = (name, ctxFieldRef) => {
  // fast refresh preserve useRef value, so that we can skip duplicated field ref waning in fast refresh update
  const idRef = useRef(null)
  const fieldRef = useMemo(() => {
    if (name instanceof FieldRef) {
      return name
    }
    idRef.current = idRef.current ?? idGen.next().value
    const fieldRef = ctxFieldRef.extend(name, { hookId: idRef.current })
    if (name && fieldRef.hookId !== idRef.current) {
      console.error(`fieldRef of '${fieldRef.fullName}' already exists`)
    }
    return fieldRef
  }, [name, ctxFieldRef])
  useEffect(() => {
    return () => {
      if (idRef.current !== null) {
        fieldRef.hookId = null
      }
    }
  }, [fieldRef])
  return fieldRef
}

function reducer({ updateId }, skipValidation) {
  return { updateId: updateId + 1, skipValidation }
}

export const useFieldWithUpdateId = (name, form) => {
  const context = useContext(Context)
  form = form ?? context.store
  invariant(
    !!form,
    `No form instance avaiable from useField of ${join(
      context.path?.fullPath,
      name,
    )}`,
  )
  const observer = form.observer
  const [{ updateId, skipValidation }, rerender] = useReducer(reducer, {
    updateId: 0,
    skipValidation: false,
  })
  const fieldRef = useFieldRefWithHookId(name, context.path ?? form.rootField)
  useEffect(() => {
    return observer.listen(
      UPDATE,
      (skipValidation = false) => {
        rerender(skipValidation)
      },
      fieldRef,
    )
  })
  return [fieldRef, updateId, skipValidation, context, rerender]
}

const useField = (name, form) => {
  const [fieldRef] = useFieldWithUpdateId(name, form)
  return fieldRef
}

export default useField
