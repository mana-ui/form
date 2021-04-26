import React, { useEffect, useRef } from "react"
import { render, screen, waitFor } from "@testing-library/react"
import Field from "../src/Field"
import Form from "../src/Form"
import useForm from "../src/useForm"
import userEvent from "@testing-library/user-event"

describe("useForm", () => {
  const initValue = { a: "hello" }
  test("useForm returns form instance", async () => {
    const handleSubmit = jest.fn()
    const Container = () => {
      const form = useForm(initValue)
      const a = form.field("a")
      const prevFormRef = useRef(form)
      useEffect(() => {
        prevFormRef.current = form
      })
      return (
        <Form init={form} onSubmit={handleSubmit}>
          <Field label="A" fieldRef={a} />
          {a.value}
          <span>
            form identity is {form === prevFormRef.current ? "" : "not"} stable
          </span>
          <button onClick={form.submit}>Submit</button>
        </Form>
      )
    }
    render(<Container />)
    const input = screen.getByLabelText("A")
    userEvent.type(input, " world")
    await waitFor(() => {
      expect(input).toHaveValue("hello world")
    })
    expect(screen.getByText("form identity is stable")).toBeInTheDocument()
    userEvent.click(screen.getByText("Submit"))
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({ a: "hello world" })
    })

    expect(await screen.findByText("hello world")).toBeInTheDocument()
  })
  test("init value is cloned, won't be changed", () => {
    expect(initValue).toEqual({ a: "hello" })
  })
})
