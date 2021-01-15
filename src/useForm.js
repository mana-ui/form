import { useEffect, useMemo, useState } from "react"
import { UPDATE } from "./events"
import useStore from "./useStore"

const useForm = (init) => {
  const updater = useState(0)[1]
  const store = useStore(init)
  const toSub = useMemo(() => new Set(), [])
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
  return useMemo(
    () =>
      new Proxy(store, {
        get(target, prop) {
          if (prop === "get") {
            return (path, noListen = false) => {
              const s = store.get(path)
              if (!noListen) {
                toSub.add(path)
              }
              return s
            }
          }
          return target[prop]
        },
      }),
    [store, toSub],
  )
}

export default useForm
