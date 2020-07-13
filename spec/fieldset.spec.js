import React from "react"
import { render } from "@testing-library/react"
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
    await userEvent.type(inputB, "{backspace}hello")
    expect(inputB).toHaveValue("hello")
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
    await userEvent.type(inputAB, "{backspace}hello")
    expect(inputAB).toHaveValue("hello")
    expect(onChange).toHaveBeenLastCalledWith({
      a: { b: "hello" },
      b: { b: "b" },
    })

    const inputBB = screen.getByLabelText("BB")
    expect(inputBB).toHaveAttribute("id", "b.b")
    expect(inputBB).toHaveValue("b")
    await userEvent.type(inputBB, "{backspace}world")
    expect(inputBB).toHaveValue("world")
    expect(onChange).toHaveBeenLastCalledWith({
      a: { b: "hello" },
      b: { b: "world" },
    })
  })
})
