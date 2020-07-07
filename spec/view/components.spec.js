import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { Field } from "../../src";
import userEvent from "@testing-library/user-event";

const Select = ({ children, ...props }) => (
  <select {...props}>{children}</select>
);

describe("Form control component", () => {
  test("default control is `input` tag", () => {
    render(
      <App>
        <Field name="f" label="F" />
      </App>
    );
    const input = screen.getByLabelText('F')
    expect(input.tagName).toBe('INPUT')
  });
  test("customize control component", () => {
    render(
      <App initValue={{ a: "a", b: false }}>
        <Field
          name="a"
          label="A"
          control={
            <Select className="custom-a">
              <option value="a">a</option>
              <option value="b">b</option>
            </Select>
          }
        />
        <Field
          name="b"
          label="B"
          control={({ get, set }) => {
            return (
              <input
                type="checkbox"
                checked={get()}
                onChange={({ target: { checked } }) => {
                  set(checked);
                }}
              />
            );
          }}
        />
      </App>
    );
    const ctrlA = screen.getByLabelText("A");
    userEvent.selectOptions(ctrlA, "b");
    expect(ctrlA).toHaveValue("b");
    const ctrlB = screen.getByLabelText("B");
    userEvent.click(ctrlB);
    expect(ctrlB).toBeChecked();
  });
});
