import React from "react"
import { render } from "@testing-library/react"
import App from "../App"
import Field from "../../src/Field"

const customRender = (className) => ({ Control, labelElem, id }) => (
  <div className={className}>
    <label htmlFor={id}>{labelElem}</label>
    <Control id={id} />
  </div>
)

describe("layout", () => {
  test("default Field render", () => {
    const { container } = render(
      <App initValue={{ a: "A", b: "B" }}>
        <Field name="a" label="A" />
        <Field name="b" label="B" render={customRender("field-b")} />
      </App>,
    )
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div>
          <label>
            A
             
            <input
              value="A"
            />
          </label>
        </div>
        <div
          class="field-b"
        >
          <label
            for="b"
          >
            B
          </label>
          <input
            id="b"
            value="B"
          />
        </div>
      </div>
    `)
  })
  test("Form fieldRender", () => {
    const { container } = render(
      <App
        initValue={{ a: "A", b: "B" }}
        fieldRender={customRender("field-render")}
      >
        <Field name="a" label="A" />
        <Field name="b" label="B" render={customRender("field-b")} />
      </App>,
    )
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="field-render"
        >
          <label
            for="a"
          >
            A
          </label>
          <input
            id="a"
            value="A"
          />
        </div>
        <div
          class="field-b"
        >
          <label
            for="b"
          >
            B
          </label>
          <input
            id="b"
            value="B"
          />
        </div>
      </div>
    `)
  })
})
