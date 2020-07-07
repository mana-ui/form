import React, { useState } from "react"
import { Form } from "../src"

const App = ({ children, initValue = { f: "a" }, onChange = () => {}, ...props }) => {
  const [value, setValue] = useState(initValue)
  return (
    <Form
      value={value}
      setValue={(v) => {
        setValue(v)
        onChange(v)
      }}
      {...props}
    >
      {() => children}
    </Form>
  )
}

export default App
