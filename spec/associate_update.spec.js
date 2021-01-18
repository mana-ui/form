import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import App from "./App"
import Field from "../src/Field"
import userEvent from "@testing-library/user-event"
import { useForm } from "../src/index"

describe("associate_update", () => {
  test("basic", async () => {
    console.error = jest.fn()
    const Container = () => {
      const form = useForm({ a: "", b: "" })
      const b = form.fieldRef("b")
      return (
        <App initValue={form}>
          <Field
            name="a"
            label="A"
            control={({ field: a }) => (
              <input
                value={"$" + a.value}
                onChange={({ target: { value } }) => {
                  const v = value.substring(1)
                  a.value = v
                  b.value = v
                }}
              />
            )}
          />
          <Field name="b" label="B" />
        </App>
      )
    }
    render(<Container />)
    const inputA = screen.getByLabelText("A")
    userEvent.type(inputA, "123")
    await waitFor(() => {
      expect(screen.getByLabelText("A")).toHaveValue("$123")
      expect(screen.getByLabelText("B")).toHaveValue("123")
    })
    expect(console.error).toHaveBeenCalledWith("fieldRef of 'b' already exists")
  })
})
