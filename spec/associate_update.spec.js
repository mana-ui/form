import React, { useEffect } from "react"
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
      const a = form.field("a")
      const b = form.field("b")
      useEffect(() =>
        form.listen((v) => {
          b.value = v
        }, a),
      )
      if (a.value !== "" && b.value === "") {
        throw new Error("a & b update in different render")
      }
      return (
        <App
          initValue={form}
          validators={{
            required: (v) => v === "" && "required",
          }}
        >
          <Field
            name="a"
            label="A"
            control={({ field: a }) => (
              <input
                value={"$" + a.value}
                onChange={({ target: { value } }) => {
                  const v = value.substring(1)
                  a.value = v
                }}
              />
            )}
          />
          <Field name="b" label="B" required />
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
    userEvent.type(inputA, "{selectall}{del}")
    await waitFor(() => {
      expect(screen.queryByText("required")).not.toBeInTheDocument()
    })
  })
})
