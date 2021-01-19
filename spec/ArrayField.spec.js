import React from "react"
import { render } from "@testing-library/react"
import App from "./App"
import { Field, ArrayField, useForm } from "../src"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import useListField from "../src/useListField"

describe("IterableField", () => {
  test("list field", async () => {
    console.error = jest.fn()
    const Item = ({ remove }) => (
      <span>
        <Field name="a" label="A" />
        <button onClick={remove}>remove</button>
      </span>
    )
    const List = () => {
      const [ListField, list] = useListField()
      return (
        <>
          <span onClick={() => list.append({ a: "a3" })}>Append</span>
          <span onClick={() => list.prepend({ a: "a4" })}>Prepend</span>
          <ListField>
            <Item />
          </ListField>
        </>
      )
    }
    const Container = () => {
      const form = useForm([{ a: "a1" }, { a: "a2" }])
      return (
        <App initValue={form}>
          <List />
        </App>
      )
    }
    render(<Container />)
    const inputAs = screen.getAllByLabelText("A")
    expect(inputAs).toHaveLength(2)
    expect(inputAs[0]).toHaveValue("a1")
    expect(inputAs[1]).toHaveValue("a2")
    userEvent.click(screen.getByText("Append"))
    await waitFor(() => {
      expect(screen.getAllByLabelText("A")).toHaveLength(3)
    })
    const removes = screen.getAllByText("remove")
    userEvent.click(removes[1])
    await waitFor(() => {
      expect(screen.getAllByLabelText("A")).toHaveLength(2)
    })
    userEvent.click(screen.getByText("Prepend"))
    await waitFor(() => {
      expect(screen.getAllByLabelText("A")).toHaveLength(3)
    })
    expect(console.error).not.toHaveBeenCalled()
  })
  test("fieldset with iterator", async () => {
    const Container = () => {
      const form = useForm([{ a: "a1" }, { a: "a2" }])
      const root = form.field("")
      return (
        <App initValue={form}>
          <div>array fields</div>
          <span onClick={() => (root.value = [...root.value, { a: "a3" }])}>
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
