import useField from "../src/useField"
import App from "./App"
import useForm from "../src/useForm"
import React from "react"
import Field from "../src/Field"
import { render } from "@testing-library/react"

// jest.mock('invariant', () => {
//   const original = jest.requireActual('invariant')
//   return {
//     __esModule: true,
//     default: jest.fn((...args) => original(...args))
//   }
// })
console.error = jest.fn()
describe("useField", () => {
  it("warns if no avaiable form instance", () => {
    const Container = () => {
      const form = useForm({})
      const field = useField("someField")
      return (
        <App init={form}>
          <Field name={field} />
        </App>
      )
    }
    expect(() => render(<Container />)).toThrow(
      "No form instance avaiable from useField of someField",
    )
  })
})
