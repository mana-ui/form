import React from "react"
import { render } from "@testing-library/react"
import App from "../App"
import Field from "../../src/Field"

describe("layout", () => {
  test("default fieldRender", () => {
    const { container } = render(
      <App initValue={{ a: "A", b: "B" }}>
        <Field name="a" label="A" />
        <Field name="b" label="B" />
      </App>,
    )
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div>
          <label
            for="a"
          >
            A
             
            <input
              id="a"
              value="A"
            />
          </label>
        </div>
        <div>
          <label
            for="b"
          >
            B
             
            <input
              id="b"
              value="B"
            />
          </label>
        </div>
      </div>
    `)
  })
})
