import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useState } from "react";
import { Field, Form } from "../src/";

const App = ({ children }) => {
  const [value, setValue] = useState({ f: "a" });
  return (
    <Form
      value={value}
      setValue={(v) => {
        setValue(v);
      }}
      fieldRender={({ Control, Label }) => (
        <Label>
          <Control />
        </Label>
      )}
    >
      {children}
    </Form>
  );
};

describe("Field", () => {
  describe("control", () => {
    test("default", async () => {
      render(
        <App>
          <Field name="f" label="F" />
        </App>
      );
      const f1Input = screen.getByLabelText("F");
      expect(f1Input).toHaveValue("a");
      await userEvent.type(f1Input, "{backspace}f");
      expect(f1Input).toHaveValue("f");
    });
    test("control as element with extra props", async () => {
      render(
        <App>
          <Field name="f" label="F" control={<input className="custom" />} />
        </App>
      );

      const f1Input = screen.getByLabelText("F");
      expect(f1Input).toHaveClass("custom");
      expect(f1Input).toHaveValue("a");
      await userEvent.type(f1Input, "{backspace}f");
      expect(f1Input).toHaveValue("f");
    });
    test("control as render prop with value & onChange overrided", async () => {
      const Input = ({ val, onChange }) => (
        <input
          value={val}
          onChange={({ target: { value } }) => onChange(value)}
        />
      );
      render(
        <App>
          <Field
            name="f"
            label="F"
            control={({ store }) => (
              <Input val={store.f} onChange={(v) => (store.f = v)} />
            )}
          />
        </App>
      );

      const f1Input = screen.getByLabelText("F");
      expect(f1Input).toHaveValue("a");
      await userEvent.type(f1Input, "{backspace}f");
      expect(f1Input).toHaveValue("f");
    });
  });

  test("render overrides fieldRender from Form", async () => {
    render(
      <App>
        <Field
          name="f"
          label="F"
          render={({ Control, Label }) => (
            <>
              <span>custom field render</span>
              <Label />
              <Control />
            </>
          )}
        />
      </App>
    );
    screen.getByText('custom field render')
    const input = screen.getByLabelText("F");
    expect(input).toHaveValue("a");
    await userEvent.type(input, "{backspace}f");
    expect(input).toHaveValue("f");
  });
});
