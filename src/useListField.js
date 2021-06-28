import React, { useMemo, useRef } from "react"
import idGenFn from "./idGenFn"
import KEYS from "./keysSymbol"
import ListField from "./ListField"
import { useFieldWithUpdateId } from "./useField"

const useListField = (field, form) => {
  const [fieldRef] = useFieldWithUpdateId(field, form)
  const listFieldRef = useRef()
  const ListComponentRef = useRef()
  return useMemo(() => {
    const keys = []
    const idGen = idGenFn()
    for (let k = 0; k < fieldRef.value.length; k++) {
      keys.push(idGen.next().value)
    }
    fieldRef[KEYS] = keys
    const listField = Object.assign(fieldRef, {
      prepend(v) {
        fieldRef[KEYS].unshift(idGen.next().value)
        const value = fieldRef.value
        fieldRef.value = [v, ...value]
      },
      append(v) {
        const value = fieldRef.value
        fieldRef[KEYS].push(idGen.next().value)
        fieldRef.value = [...value, v]
      },
      remove(i) {
        fieldRef[KEYS].splice(i, 1)
        const value = fieldRef.value
        value.splice(i, 1)
        fieldRef.value = value
      },
      clear() {
        fieldRef[KEYS] = []
        fieldRef.value = []
      },
    })
    if (!listFieldRef.current || listField !== listFieldRef.current) {
      ListComponentRef.current = ({ children }) => (
        <ListField listField={listField}>{children}</ListField>
      )
      listFieldRef.current = listField
    }

    return [ListComponentRef.current, listField]
  }, [fieldRef])
}

export default useListField
