import { useEffect, useRef, useState } from "react"
import { UPDATE } from "./events"
import useStore from "./useStore"

const useForm = (init) => {
  const updater = useState(0)[1]
  const toSub = useRef(new Set())
  const store = useStore(init)
  useEffect(() => {
    const unsubs = []
    for (const sub of toSub.current) {
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
  const formRef = useRef()
  if (!formRef.current) {
    formRef.current = new Proxy(store, {
      get(target, prop) {
        if (prop === "get") {
          return (path, noListen = false) => {
            const s = store.get(path)
            if (!noListen) {
              toSub.current.add(path)
            }
            return s
          }
        }
        return target[prop]
      },
    })
  }
  return formRef.current
}

export default useForm
