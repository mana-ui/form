import Store from "./Store"
import { useRef } from "react"
import Observer from "./Observer"

const useStore = (init) => {
  const ref = useRef()
  if (!ref.current) {
    if (init instanceof Store) {
      ref.current = init
    } else {
      ref.current = new Store(init, new Observer())
    }
  }
  return ref.current
}

export default useStore
