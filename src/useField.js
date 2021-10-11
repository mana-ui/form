import { useContext, useEffect, useMemo, useReducer, useRef } from "react"
import { UPDATE } from "./events"
import FieldRef from "./FieldRef"
import { Context } from "./Form"
import idGenFn from "./idGenFn"

const idGen = idGenFn()

function reducer({ updateId }, skipValidation) {
  return { updateId: updateId + 1, skipValidation }
}

export const useFieldWithUpdateId = (name, form) => {
  // fast refresh preserve useRef value, so that we can skip duplicated field ref waning in fast refresh update
  const idRef = useRef(null)
  const { path, store } = useContext(Context)
  const observer = store?.observer ?? form.observer
  const [{ updateId, skipValidation }, rerender] = useReducer(reducer, {
    updateId: 0,
    skipValidation: false,
  })
  const fieldRef = useMemo(() => {
    if (name instanceof FieldRef) {
      return name
    }
    idRef.current = idRef.current ?? idGen.next().value
    const ctxField = path ?? form.rootField
    return ctxField.extend(name, { hookId: idRef.current })
  }, [name, path, form])
  useEffect(() => {
    return observer.listen(
      UPDATE,
      (skipValidation = false) => {
        rerender(skipValidation)
      },
      fieldRef,
    )
  })
  return [fieldRef, updateId, skipValidation]
}

const useField = (name, form) => {
  const { store } = useContext(Context)
  const [fieldRef] = useFieldWithUpdateId(name, form ?? store)
  return fieldRef
}

export default useField
