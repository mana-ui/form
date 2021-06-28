import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { UPDATE } from "./events"
import FieldRef from "./FieldRef"
import { Context } from "./Form"
import idGenFn from "./idGenFn"

const idGen = idGenFn()

export const useFieldWithUpdateId = (name, form) => {
  // fast refresh preserve useRef value, so that we can skip duplicated field ref waning in fast refresh update
  const idRef = useRef(null)
  const { path, store } = useContext(Context)
  const observer = store?.observer ?? form.observer
  const [updateId, rerender] = useState(0)
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
      () => {
        rerender((x) => x + 1)
      },
      fieldRef,
    )
  })
  return [fieldRef, updateId]
}

const useField = (name, form) => {
  const [fieldRef] = useFieldWithUpdateId(name, form)
  return fieldRef
}

export default useField
