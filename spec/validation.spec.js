import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { Field } from "../src/"
import App from "./App"

describe("validator", () => {
  test("inline validator", async () => {
    render(
      <App>
        <Field
          name="f"
          label="F"
          validators={{
            required: (v) => v === "" && "F is required",
            maxLength: (v, max) => v.length > max && "F exceeds max length",
          }}
          required
          maxLength={5}
        />
      </App>,
    )
    const input = screen.getByLabelText(/F/)
    userEvent.type(input, "{backspace}")
    await waitFor(() => {
      expect(screen.getByText("F is required")).toBeInTheDocument()
    })
    userEvent.type(input, "abc")
    await waitFor(() => {
      expect(screen.queryByText("F is required")).not.toBeInTheDocument()
    })
    userEvent.type(input, "def")
    await waitFor(() => {
      expect(screen.getByText("F exceeds max length")).toBeInTheDocument()
    })
    userEvent.type(input, "{backspace}")
    await waitFor(() => {
      expect(screen.queryByText("F exceeds max length")).not.toBeInTheDocument()
    })
  })
  test("validators from higher component", async () => {
    render(
      <App
        validators={{
          required: (v) => v === "" && "F is required",
          maxLength: (v, max) => v.length > max && "F exceeds max length",
        }}
      >
        <Field name="f" label="F" required maxLength={5} />
      </App>,
    )
    const input = screen.getByLabelText(/F/)
    userEvent.type(input, "{backspace}")
    await waitFor(() => {
      expect(screen.getByText("F is required")).toBeInTheDocument()
    })
    userEvent.type(input, "abc")
    await waitFor(() => {
      expect(screen.queryByText("F is required")).not.toBeInTheDocument()
    })
    userEvent.type(input, "def")
    await waitFor(() => {
      expect(screen.getByText("F exceeds max length")).toBeInTheDocument()
    })
    userEvent.type(input, "{backspace}")
    await waitFor(() => {
      expect(screen.queryByText("F exceeds max length")).not.toBeInTheDocument()
    })
  })
})
