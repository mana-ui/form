import React from "react"
import { render } from "@testing-library/react"
import App from "./App"
import { Field, useForm } from "../src"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import useListField from "../src/useListField"
import ListField from "../src/ListField"

describe("ListField", () => {
  test("define by string path", async () => {
    console.error = jest.fn()
    const Item = ({ remove }) => (
      <span>
        <Field name="a" label="A" />
        <button onClick={remove}>remove</button>
      </span>
    )
    const List = ({ name }) => {
      const list = useListField(name)
      return (
        <>
          <span onClick={() => list.append({ a: "a3" })}>Append</span>
          <span onClick={() => list.prepend({ a: "a4" })}>Prepend</span>
          <span onClick={() => list.clear()}>Clear</span>
          <ListField field={list}>
            <Item />
          </ListField>
        </>
      )
    }
    const Container = () => {
      const form = useForm({ arr: [{ a: "a1" }, { a: "a2" }] })
      return (
        <App initValue={form}>
          <List name="arr" />
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
    userEvent.click(screen.getByText("Clear"))
    await waitFor(() => {
      expect(screen.queryAllByLabelText("A")).toHaveLength(0)
    })

    expect(console.error).not.toHaveBeenCalled()
  })
  test("define by field instance", async () => {
    console.error = jest.fn()
    const Item = ({ remove }) => (
      <span>
        <Field name="a" label="A" />
        <button onClick={remove}>remove</button>
      </span>
    )
    const List = ({ list }) => {
      return (
        <>
          <span onClick={() => list.append({ a: "a3" })}>Append</span>
          <span onClick={() => list.prepend({ a: "a4" })}>Prepend</span>
          <span onClick={() => list.clear()}>Clear</span>
          <ListField field={list}>
            <Item />
          </ListField>
        </>
      )
    }
    const Container = () => {
      const form = useForm({ arr: [{ a: "a1" }, { a: "a2" }] })
      const list = useListField("arr", form)
      return (
        <App initValue={form}>
          <List list={list} />
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
    userEvent.click(screen.getByText("Clear"))
    await waitFor(() => {
      expect(screen.queryAllByLabelText("A")).toHaveLength(0)
    })

    expect(console.error).not.toHaveBeenCalled()
  })
})
