import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { Field } from "../src/"
import App from "./App"

describe("validator", () => {
  const maxLength = {
    validate: (v) => v.length <= 5,
    message: ({ label }) => <>{label} exceeds max length</>,
  }
  const minLength = { validate: (v) => v.length >= 3, message: "min length" }
  test("required", async () => {
    render(
      <App>
        <Field name="f" label="F" required />
      </App>,
    )
    const input = screen.getByLabelText(/F/)
    expect(screen.queryByText("required")).toBe(null)
    expect(input).toHaveValue("a")
    await userEvent.type(input, "{backspace}")
    expect(screen.getByText("required")).not.toBe(null)
    await userEvent.type(input, "x")
    expect(screen.queryByText("required")).toBe(null)
  })
  test("inline validator", async () => {
    render(
      <App>
        <Field name="f" label="F" validators={[maxLength]} />
      </App>,
    )
    const input = screen.getByLabelText(/F/)
    await userEvent.type(input, "{backspace}abcdefg")
    expect(screen.getByText("F exceeds max length")).toBeInTheDocument()
  })
  test("function", async () => {
    render(
      <App rules={{ maxLength, minLength }}>
        <Field
          name="f"
          label="F"
          required
          validators={["maxLength", "minLength"]}
        />
      </App>,
    )
    const input = screen.getByLabelText(/F/)
    await userEvent.type(input, "{backspace}")
    expect(screen.getByText("required")).not.toBe(null)
    await userEvent.type(input, "a")
    expect(screen.getByText("min length")).not.toBe(null)
    await userEvent.type(input, "bcdefg")
    expect(screen.getByText("F exceeds max length")).not.toBe(null)
  })
})
