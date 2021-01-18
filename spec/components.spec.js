import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import App from "./App"
import { Field } from "../src"
import userEvent from "@testing-library/user-event"

describe("Form control component", () => {
  test("default control is `input` tag", () => {
    render(
      <App>
        <Field name="f" label="F" />
      </App>,
    )
    const input = screen.getByLabelText("F")
    expect(input.tagName).toBe("INPUT")
  })
  test("customize control component", async () => {
    render(
      <App
        initValue={{ a: "", b: "b1", c: false }}
        fieldRender={({ Control, labelElem, error, id }) => (
          <div>
            <label htmlFor={id}>{labelElem}</label>
            <Control id={id} />
            {error}
          </div>
        )}
      >
        <Field name="a" label="A" />
        <Field
          name="b"
          label="B"
          control={
            <select className="custom-b">
              <option value="b1">B1</option>
              <option value="b2">B2</option>
            </select>
          }
        />
        <Field
          name="c"
          label="C"
          control={({ field }) => (
            <input
              className="custom-c"
              type="checkbox"
              checked={field.value}
              onChange={({ target: { checked } }) => (field.value = checked)}
            />
          )}
        />
      </App>,
    )
    const inputA = screen.getByLabelText("A")
    userEvent.type(inputA, "abc")
    await waitFor(() => {
      expect(inputA).toHaveValue("abc")
    })

    const selectB = screen.getByLabelText("B")
    expect(selectB).toHaveClass("custom-b")
    userEvent.selectOptions(selectB, screen.getByText("B2"))
    await waitFor(() => {
      expect(selectB).toHaveValue("b2")
    })

    const checkC = screen.getByLabelText("C")
    expect(checkC).toHaveClass("custom-c")
    expect(checkC).toHaveAttribute("id", "c")
    userEvent.click(checkC)
    await waitFor(() => {
      expect(checkC).toBeChecked()
    })
  })
  test("disabled should received by control", async () => {
    render(
      <App>
        <Field name="f" label="F" disabled />
      </App>,
    )
    const control = screen.getByLabelText("F")
    expect(control).toBeDisabled()
  })
})
