import React, { useEffect } from "react"
import { Form } from "../src"
import { useStore } from "../src/index"

const App = ({ children, initValue = { f: "a" }, onChange, ...props }) => {
  const store = useStore(initValue)
  useEffect(() => {
    if (onChange) {
      store.listen(onChange)
    }
  })
  return (
    <Form init={store} {...props}>
      {(args) => (typeof children === "function" ? children(args) : children)}
    </Form>
  )
}

export default App
