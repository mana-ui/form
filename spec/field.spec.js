import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import { Form, Field } from "../src/";
import userEvent from "@testing-library/user-event";

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
  test("default control & label", async () => {
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
  test("control with extra props", async () => {
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
  test("control with value & onChange overrided", async () => {
      const Input = ({val, onChange}) => ( 
         <input value={val} onChange={({target: {value}}) => onChange(value)}/> 
  )
    render(
      <App>
        <Field
          name="f"
          label="F"
          control={({ store }) => <Input val={store.f} onChange={(v) => store.f = v} />}
        />
      </App>
    );

    const f1Input = screen.getByLabelText("F");
    expect(f1Input).toHaveValue("a");
    await userEvent.type(f1Input, "{backspace}f");
    expect(f1Input).toHaveValue("f");
  });
});
