import { render, screen, waitFor } from "@testing-library/react"
import React from "react"
import Field from "../src/Field"
import App from "./App"
import userEvent from "@testing-library/user-event"

describe("Form submission", () => {
  test("onSubmti get value", async () => {
    const handleSubmit = jest.fn()
    render(
      <App
        initValue={{ a: "x", b: "y" }}
        onSubmit={(v) => {
          handleSubmit(v)
        }}
      >
        {({ submit }) => (
          <>
            <Field name="a" label="A" />
            <Field name="b" label="B" />
            <button onClick={submit}>submit</button>
          </>
        )}
      </App>,
    )
    userEvent.click(screen.getByText("submit"))
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenLastCalledWith({ a: "x", b: "y" })
    })
  })
  test("validation failure block submit", async () => {
    const handleSubmit = jest.fn()
    render(
      <App initValue={{ f: "", b: "x" }} onSubmit={handleSubmit}>
        {({ submit }) => (
          <>
            <Field
              name="f"
              label="F"
              validators={{ required: (v) => v === "" && "f is required" }}
              required
            />
            <Field name="b" label="B" />
            <button onClick={submit}>submit</button>
          </>
        )}
      </App>,
    )
    userEvent.click(screen.getByText("submit"))
    expect(await screen.findByText("f is required")).toBeInTheDocument()
    expect(handleSubmit).not.toHaveBeenCalled()
  })
})
