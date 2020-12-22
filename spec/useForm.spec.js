import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import Field from "../src/Field"
import Form from "../src/Form"
import useForm from "../src/useForm"
import userEvent from "@testing-library/user-event"

describe("useForm", () => {
  test("useForm returns form instance", async () => {
    const handleSubmit = jest.fn()
    const Container = () => {
      const form = useForm({ a: "hello" })
      return (
        <Form init={form} onSubmit={handleSubmit}>
          <Field label="A" name="a" />
          {form.get("a")}
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
    userEvent.click(screen.getByText("Submit"))
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({ value: { a: "hello world" } })
    })

    expect(await screen.findByText("hello world")).toBeInTheDocument()
  })
})
