import { useMemo } from "react"
import FieldRef from "./FieldRef"

const useExtendField = (name, ctxField, Type) => {
  return useMemo(() => {
    if (name instanceof FieldRef) {
      return name
    }
    return ctxField.extend(name, { inField: true, Type })
  }, [name, ctxField, Type])
}

export default useExtendField
