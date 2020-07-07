import React, { useState } from "react"
import { Form } from "../src"

const App = ({ children, initValue = { f: "a" }, ...props }) => {
  const [value, setValue] = useState(initValue)
  return (
    <Form
      value={value}
      setValue={(v) => {
        setValue(v)
      }}
      {...props}
    >
      {() => children}
    </Form>
  )
}

export default App
