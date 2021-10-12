import { useEffect, useMemo, useRef, useState } from "react"
import { UPDATE, VALIDATE } from "./events"
import useStore from "./useStore"

const useForm = (init) => {
  const updater = useState(0)[1]
  const store = useStore(init)
  const toSub = useMemo(() => new Set(), [])
  const subValid = useRef(false)
  const validRef = useRef(false)
  useEffect(() => {
    const unsubs = []
    for (const sub of toSub) {
      unsubs.push(
        store.observer.listen(UPDATE, () => updater((x) => x + 1), sub),
      )
    }
    return () => {
      for (const unsub of unsubs) {
        unsub()
      }
    }
  })
  useEffect(() => {
    const sub = subValid.current
    subValid.current = false
    return store.observer.listen(
      VALIDATE,
      (err) => {
        if (validRef.current !== (err === null)) {
          validRef.current = err === null
          if (sub) updater((x) => x + 1)
        }
      },
      store.rootField,
    )
  })
  return useMemo(
    () =>
      new Proxy(store, {
        get(target, prop) {
          if (prop === "field") {
            return (path) => {
              const field = store.field(path)
              toSub.add(field)
              return field
            }
          } else if (prop === "valid") {
            subValid.current = true
            return validRef.current
          }
          return target[prop]
        },
      }),
    [store, toSub],
  )
}

export default useForm
