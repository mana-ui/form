import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React, { useState } from "react"
import { Field } from "../src/"
import App from "./App"
import { useForm, useField } from "../src/index"

describe("validator", () => {
  test("inline validator", async () => {
    const Container = () => {
      const form = useForm({ f: "" })
      return (
        <App init={form}>
          <Field
            name="f"
            label="F"
            validators={{
              required: (v) => v === "" && <span>F is required</span>,
              maxLength: (v, max) => v.length > max && "F exceeds max length",
            }}
            required
            maxLength={5}
          />
          {form.valid || <span>invalid</span>}
          <button onClick={form.submit}>submit</button>
        </App>
      )
    }
    render(<Container />)
    expect(screen.queryByText("F is required")).not.toBeInTheDocument()
    expect(screen.getByText("invalid")).toBeInTheDocument()
    const submit = screen.getByText("submit")
    userEvent.click(submit)
    await waitFor(() => {
      expect(screen.getByText("F is required")).toBeInTheDocument()
    })
    const input = screen.getByLabelText(/F/)
    userEvent.type(input, "abc")
    await waitFor(() => {
      expect(screen.queryByText("F is required")).not.toBeInTheDocument()
      expect(screen.queryByText("invalid")).not.toBeInTheDocument()
    })
    userEvent.type(input, "def")
    await waitFor(() => {
      expect(screen.getByText("F exceeds max length")).toBeInTheDocument()
      expect(screen.queryByText("invalid")).toBeInTheDocument()
    })
    userEvent.type(input, "{backspace}")
    await waitFor(() => {
      expect(screen.queryByText("F exceeds max length")).not.toBeInTheDocument()
      expect(screen.queryByText("invalid")).not.toBeInTheDocument()
    })
  })
  test("validators from higher component", async () => {
    render(
      <App
        validators={{
          required: (v, _, { label }) => {
            return v === "" && <>{label} is required</>
          },
          maxLength: (v, max, { label }) => {
            return v.length > max && <>{label} exceeds max length</>
          },
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
  test("disabled field validators should be skipped", async () => {
    const handleSubmit = jest.fn()
    const Container = () => {
      const [disabled, setDisabled] = useState(false)
      const form = useForm({ f: "" })
      const f = useField("f", form)
      return (
        <App
          initValue={form}
          onSubmit={handleSubmit}
          validators={{
            required: (v) => v === "" && "F is required",
          }}
        >
          <Field fieldRef={f} label="F" disabled={disabled} required />
          <button
            onClick={() => {
              setDisabled(true)
              f.value = ""
            }}
          >
            toggle
          </button>
          <button onClick={form.submit}>submit</button>
        </App>
      )
    }
    render(<Container />)
    fireEvent.click(screen.getByText("toggle"))
    await waitFor(() => {
      expect(screen.getByLabelText("F")).toBeDisabled()
    })
    expect(screen.queryByText("F is required")).not.toBeInTheDocument()
    userEvent.click(screen.getByText("submit"))
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
  test("validators run one by one in chronological order, unexpected error won't get thrown until previous validator passed.", async () => {
    render(
      <App>
        <Field
          name="f"
          label="F"
          validators={{
            required: (v) => v === "" && <span>F is required</span>,
            latter: () => {
              throw new Error("unexpected error")
            },
          }}
          required
          latter
        />
      </App>,
    )
    const input = screen.getByLabelText(/F/)
    userEvent.type(input, "{backspace}")
    await waitFor(() => {
      expect(screen.getByText("F is required")).toBeInTheDocument()
    })
  })
})
