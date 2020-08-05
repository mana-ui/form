import React from "react"
import { render, waitFor } from "@testing-library/react"
import App from "./App"
import { FieldSet, Field } from "../src"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

describe("FieldSet", () => {
  test("multi layer form", async () => {
    const onChange = jest.fn()
    render(
      <App initValue={{ a: { b: "b" } }} onChange={onChange}>
        <FieldSet name="a">
          <Field name="b" label="B" />
        </FieldSet>
      </App>,
    )
    const inputB = screen.getByLabelText("B")
    expect(inputB).toHaveValue("b")
    userEvent.type(inputB, "{backspace}hello")
    await waitFor(() => {
      expect(inputB).toHaveValue("hello")
    })
    expect(onChange).toHaveBeenLastCalledWith({ a: { b: "hello" } })
  })
  test("id", async () => {
    const onChange = jest.fn()
    render(
      <App
        initValue={{ a: { b: "b" }, b: { b: "b" } }}
        onChange={onChange}
        fieldRender={({ Control, labelElem, error, id }) => (
          <div>
            <label htmlFor={id}>{labelElem}</label>
            <Control id={id} />
            {error}
          </div>
        )}
      >
        <FieldSet name="a">
          <Field name="b" label="AB" />
        </FieldSet>
        <FieldSet name="b">
          <Field name="b" label="BB" />
        </FieldSet>
      </App>,
    )

    const inputAB = screen.getByLabelText("AB")
    expect(inputAB).toHaveAttribute("id", "a.b")
    expect(inputAB).toHaveValue("b")
    userEvent.type(inputAB, "{backspace}hello")
    await waitFor(() => {
      expect(inputAB).toHaveValue("hello")
    })
    expect(onChange).toHaveBeenLastCalledWith({
      a: { b: "hello" },
      b: { b: "b" },
    })

    const inputBB = screen.getByLabelText("BB")
    expect(inputBB).toHaveAttribute("id", "b.b")
    expect(inputBB).toHaveValue("b")
    userEvent.type(inputBB, "{backspace}world")
    await waitFor(() => {
      expect(inputBB).toHaveValue("world")
    })
    expect(onChange).toHaveBeenLastCalledWith({
      a: { b: "hello" },
      b: { b: "world" },
    })
  })
  test("fieldset validator", async () => {
    render(
      <App initValue={{ a: "a", b: "b" }}>
        {({ submit }) => (
          <>
            {" "}
            <FieldSet
              validators={{
                same: ({ a, b }) => a !== b && "A and B should be same",
              }}
              same
            >
              {({ error }) => (
                <>
                  <Field name="a" label="A" />
                  <Field name="b" label="B" />
                  {error}
                </>
              )}
            </FieldSet>
            <button onClick={submit}>submit</button>
          </>
        )}
      </App>,
    )
    userEvent.click(screen.getByText("submit"))
    await waitFor(() => {
      expect(screen.getByText("A and B should be same")).toBeInTheDocument()
    })
    const inputA = screen.getByLabelText("A")
    const inputB = screen.getByLabelText("B")
    userEvent.type(inputA, "hello")
    userEvent.type(inputB, "world")
    await waitFor(() => {
      expect(screen.getByText("A and B should be same")).toBeInTheDocument()
    })
  })
})
