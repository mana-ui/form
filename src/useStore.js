import Store from "./Store"
import { useRef } from "react"

const useStore = (init, observer) => {
  const ref = useRef()
  if (!ref.current) {
    if (init instanceof Store) {
      init.setObserver(observer)
      ref.current = init
    } else {
      ref.current = new Store(init, observer)
    }
  }
  return ref.current
}

export default useStore
