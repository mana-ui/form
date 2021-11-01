import useField from "../src/useField"
import App from "./App"
import useForm from "../src/useForm"
import React, { useState } from "react"
import Field from "../src/Field"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

console.error = jest.fn()
describe("useField", () => {
  it("does not warn on dynamic field", async () => {
    const Container = () => {
      const [show, setShow] = useState(true)
      return (
        <App>
          {show && <Field name="f" label="F" />}
          <button onClick={() => setShow(!show)}>toggle</button>
        </App>
      )
    }
    render(<Container />)
    const toggle = screen.getByText("toggle")
    userEvent.click(toggle)
    userEvent.click(toggle)
    expect(console.error).not.toHaveBeenCalled()
  })
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
  it("works in nested Form", () => {
    const Comp = ({ children, name }) => {
      const form = useForm({ [name]: name })
      const field = useField(name, form)
      return (
        <App init={form}>
          <Field name={field} label={name} />
          {children}
        </App>
      )
    }
    render(
      <Comp name="outter">
        <Comp name="inner" />
      </Comp>,
    )
    expect(screen.getByLabelText("outter")).toHaveValue("outter")
    expect(screen.getByLabelText("inner")).toHaveValue("inner")
  })
})
