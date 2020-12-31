import React from "react"
import { render } from "@testing-library/react"
import App from "./App"
import { Field, ArrayField, useForm } from "../src"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

describe("IterableField", () => {
  test("fieldset with iterator", async () => {
    const Container = () => {
      const form = useForm([{ a: "a1" }, { a: "a2" }])
      return (
        <App initValue={form}>
          <div>array fields</div>
          <span onClick={() => form.set((value) => [...value, { a: "a3" }])}>
            Add
          </span>
          <ArrayField>
            <Field name="a" label="A" />
          </ArrayField>
        </App>
      )
    }
    render(<Container />)
    expect(screen.getByText("array fields")).toBeInTheDocument()
    const inputAs = screen.getAllByLabelText("A")
    expect(inputAs).toHaveLength(2)
    expect(inputAs[0]).toHaveValue("a1")
    expect(inputAs[1]).toHaveValue("a2")
    userEvent.click(screen.getByText("Add"))
    await waitFor(() => {
      expect(screen.getAllByLabelText("A")).toHaveLength(3)
    })
  })
})
