import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import App from "./App"
import Field from "../src/Field"
import userEvent from "@testing-library/user-event"

describe("associate_update", () => {
  test("basic", async () => {
    render(
      <App initValue={{ a: "", b: "" }}>
        <Field
          name="a"
          label="A"
          control={({ get, set }) => (
            <input
              value={get()}
              onChange={({ target: { value } }) => {
                set(value)
                set(value, "b")
              }}
            />
          )}
        />
        <Field name="b" label="B" />
      </App>,
    )
    const inputA = screen.getByLabelText("A")
    userEvent.type(inputA, "123")
    await waitFor(() => {
      expect(screen.getByLabelText("B")).toHaveValue("123")
    })
  })
})
