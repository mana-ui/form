import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Form from "./Form";
import Field from "./Field";
import userEvent from "@testing-library/user-event";

const Input = (props) => {
  return <input {...props} id="component" />;
};

describe("Form", () => {
  it("renders children", () => {
    render(
      <Form value={{}}>
        <span>form content</span>
      </Form>
    );
    screen.getByText("form content");
  });
  it("provides value & onChange for fields", async () => {
    const App = () => {
      const [value, setValue] = useState({
        f1: "a",
        f2: "b",
        f3: "c",
        f4: "d",
      });
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
          <Field name="f1" label="F1" />
          <Field name="f2" control={<Input className="f2class" />} label="F2" />
          {/* <Field name="f3" control={({ value }) => <Input value={value + 1} />} label></Field> */}
          {/* <Field name="f3" label="F3">
          <input id="children" />
        </Field>*/}
        </Form>
      );
    };
    render(<App />);
    const f1Input = screen.getByLabelText("F1");
    expect(f1Input).toHaveValue("a");
    await userEvent.type(f1Input, "{backspace}f1");
    expect(f1Input).toHaveValue("f1");

    const f2Input = screen.getByLabelText("F2");
    expect(f2Input).toHaveAttribute("id", "component");
    expect(f2Input).toHaveAttribute("class", "f2class");
    expect(f2Input).toHaveValue("b");
    await userEvent.type(f2Input, "{backspace}f2");
    expect(f2Input).toHaveValue("f2");

    // const f3Input = screen.getByLabelText('F3')
    // expect(f3Input).toHaveAttribute('id', 'children')
    // expect(f3Input).toHaveValue('c')
    // await userEvent.type(f3Input, '{backspace}f3')
    // expect(f3Input).toHaveValue('f3')
  });
});
